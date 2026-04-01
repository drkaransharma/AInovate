-- AInovate INaaS — Supabase Schema (Multi-Tenant with RLS)
-- Run this in Supabase SQL Editor to set up all tables
-- NOTE: Run this on a FRESH database, or drop existing tables first

-- ════════════════════════════════════════════
-- 1. PROFILES (extends auth.users)
-- ════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ════════════════════════════════════════════
-- 2. WORKSPACES (organisations / tenants)
-- ════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS workspaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  industry TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_workspaces_slug ON workspaces(slug);

-- ════════════════════════════════════════════
-- 3. WORKSPACE MEMBERS (user ↔ workspace)
-- ════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS workspace_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, workspace_id)
);

CREATE INDEX idx_wm_user ON workspace_members(user_id);
CREATE INDEX idx_wm_workspace ON workspace_members(workspace_id);

-- ════════════════════════════════════════════
-- 4. WORKSPACE INVITES
-- ════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS workspace_invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
  token UUID DEFAULT gen_random_uuid() UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_invites_token ON workspace_invites(token);
CREATE INDEX idx_invites_workspace ON workspace_invites(workspace_id);

-- ════════════════════════════════════════════
-- 5. IDEAS (workspace-scoped)
-- ════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  department TEXT NOT NULL,
  category TEXT,
  priority TEXT CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
  impact_score INTEGER CHECK (impact_score >= 0 AND impact_score <= 100),
  ai_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_ideas_workspace ON ideas(workspace_id);
CREATE INDEX idx_ideas_department ON ideas(workspace_id, department);
CREATE INDEX idx_ideas_priority ON ideas(workspace_id, priority);
CREATE INDEX idx_ideas_category ON ideas(workspace_id, category);
CREATE INDEX idx_ideas_created_at ON ideas(workspace_id, created_at DESC);

-- ════════════════════════════════════════════
-- 6. DESIGN THINKING SESSIONS (workspace-scoped)
-- ════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS design_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  context TEXT NOT NULL,
  current_stage TEXT NOT NULL DEFAULT 'empathize',
  stages_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_ds_workspace ON design_sessions(workspace_id);
CREATE INDEX idx_ds_created_at ON design_sessions(workspace_id, created_at DESC);

-- ════════════════════════════════════════════
-- 7. SENTIMENT ANALYSES (workspace-scoped)
-- ════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS sentiment_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  sentiment_score NUMERIC(4,2) CHECK (sentiment_score >= -1 AND sentiment_score <= 1),
  inclusion_risk TEXT,
  recommendation TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_sa_workspace ON sentiment_analyses(workspace_id);
CREATE INDEX idx_sa_created_at ON sentiment_analyses(workspace_id, created_at DESC);

-- ════════════════════════════════════════════
-- 8. HELPER FUNCTION: check workspace membership
-- ════════════════════════════════════════════

CREATE OR REPLACE FUNCTION is_workspace_member(ws_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_id = ws_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_workspace_role(ws_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role FROM workspace_members
    WHERE workspace_id = ws_id AND user_id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ════════════════════════════════════════════
-- 9. ROW LEVEL SECURITY POLICIES
-- ════════════════════════════════════════════

-- ── Profiles ──
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view any profile"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- ── Workspaces ──
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their workspaces"
  ON workspaces FOR SELECT
  USING (is_workspace_member(id));

CREATE POLICY "Anyone can create a workspace"
  ON workspaces FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Owners/admins can update workspace"
  ON workspaces FOR UPDATE
  USING (get_workspace_role(id) IN ('owner', 'admin'));

-- ── Workspace Members ──
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their workspace members"
  ON workspace_members FOR SELECT
  USING (is_workspace_member(workspace_id));

CREATE POLICY "Authenticated users can insert membership"
  ON workspace_members FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Owners/admins can update members"
  ON workspace_members FOR UPDATE
  USING (get_workspace_role(workspace_id) IN ('owner', 'admin'));

CREATE POLICY "Owners can remove members"
  ON workspace_members FOR DELETE
  USING (get_workspace_role(workspace_id) = 'owner' OR user_id = auth.uid());

-- ── Workspace Invites ──
ALTER TABLE workspace_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view workspace invites"
  ON workspace_invites FOR SELECT
  USING (is_workspace_member(workspace_id));

CREATE POLICY "Admins/owners can create invites"
  ON workspace_invites FOR INSERT
  WITH CHECK (get_workspace_role(workspace_id) IN ('owner', 'admin'));

CREATE POLICY "Anyone can view invite by token"
  ON workspace_invites FOR SELECT
  USING (true);

CREATE POLICY "Admins/owners can delete invites"
  ON workspace_invites FOR DELETE
  USING (get_workspace_role(workspace_id) IN ('owner', 'admin'));

-- ── Ideas ──
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view workspace ideas"
  ON ideas FOR SELECT
  USING (is_workspace_member(workspace_id));

CREATE POLICY "Members can create ideas"
  ON ideas FOR INSERT
  WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Members can update ideas"
  ON ideas FOR UPDATE
  USING (is_workspace_member(workspace_id));

CREATE POLICY "Admins/owners can delete ideas"
  ON ideas FOR DELETE
  USING (get_workspace_role(workspace_id) IN ('owner', 'admin'));

-- ── Design Sessions ──
ALTER TABLE design_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view workspace sessions"
  ON design_sessions FOR SELECT
  USING (is_workspace_member(workspace_id));

CREATE POLICY "Members can create sessions"
  ON design_sessions FOR INSERT
  WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "Members can update sessions"
  ON design_sessions FOR UPDATE
  USING (is_workspace_member(workspace_id));

-- ── Sentiment Analyses ──
ALTER TABLE sentiment_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view workspace analyses"
  ON sentiment_analyses FOR SELECT
  USING (is_workspace_member(workspace_id));

CREATE POLICY "Members can create analyses"
  ON sentiment_analyses FOR INSERT
  WITH CHECK (is_workspace_member(workspace_id));

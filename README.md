# AInovate — Innovation as a Service (INaaS)

An AI-native platform that helps organizations capture ideas, run Design Thinking sessions, and analyze sentiment — all powered by Anthropic's Claude API.

## Modules

### 1. AI Idea Engine (`/idea-engine`)
Submit ideas in plain language. Claude API automatically analyzes and tags each idea with:
- **Category** (Product Innovation, Process Improvement, Cost Reduction, etc.)
- **Priority** (Low, Medium, High, Critical)
- **Impact Score** (0-100)
- **AI Summary**

### 2. Idea Dashboard (`/dashboard`)
Browse all submitted ideas with filters:
- Filter by department, priority, and category
- KPI cards showing total ideas, average impact score, critical/high priority counts
- Sorted by newest first

### 3. AI Co-Facilitator (`/co-facilitator`)
Run a complete 5-stage Design Thinking session with AI streaming responses:
1. **Empathize** — Understand users and their needs
2. **Define** — Frame the core problem
3. **Ideate** — Generate creative solutions
4. **Prototype** — Plan tangible prototypes
5. **Test** — Validate with real users

### 4. Sentiment Pulse (`/sentiment`)
Analyze any text and get:
- **Sentiment Score** (-1.0 to +1.0) with visual gauge
- **Inclusion Risk** assessment (None/Low/Medium/High)
- **Emotional Tone** detection
- **Key Themes** extraction
- **AI Recommendation** for improvement

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database & Auth:** Supabase
- **AI:** Anthropic Claude API (claude-sonnet-4-20250514)
- **Styling:** Tailwind CSS
- **Language:** TypeScript

## Setup

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project
- An [Anthropic API key](https://console.anthropic.com)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd idea-insight
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your keys:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### 3. Enable Supabase Auth

In your Supabase project dashboard:
1. Go to **Authentication > Providers** and ensure Email auth is enabled
2. (Optional) Disable email confirmation for development under **Authentication > Settings**

### 4. Set up the database

Go to your Supabase project dashboard, open the **SQL Editor**, and run the contents of `supabase-schema.sql`. This creates:
- `profiles` table (auto-created on user signup via trigger)
- `workspaces` table (multi-tenant organisations)
- `workspace_members` table (user-to-workspace with roles)
- `workspace_invites` table (pending invitations)
- `ideas` table (workspace-scoped)
- `design_sessions` table (workspace-scoped)
- `sentiment_analyses` table (workspace-scoped)
- Row Level Security policies enforcing workspace isolation
- Helper functions: `is_workspace_member()`, `get_workspace_role()`

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Design System

- **Background:** Black (#000000)
- **Accent:** Gold (#FFD246)
- **Headings:** Georgia serif
- **Body:** Calibri sans-serif
- **Cards:** Dark (#111111) with subtle borders (#222222)

## Multi-Tenancy Architecture

Each organisation gets its own **workspace** with fully isolated data:

- **Supabase RLS** enforces data isolation at the database level
- `is_workspace_member()` helper function checks membership in every policy
- Roles: **owner** (full control), **admin** (manage members), **member** (create content), **viewer** (read-only)
- Invite system with token-based acceptance

### Data Flow
1. User registers → creates account + workspace → becomes owner
2. Owner invites members → invite link with token
3. All API calls include `workspace_id` → RLS filters data automatically
4. Even if a user has the workspace_id, RLS blocks access without membership

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Public landing page
│   ├── login/page.tsx           # Sign in
│   ├── register/page.tsx        # Create account + workspace
│   ├── invite/page.tsx          # Accept workspace invite
│   ├── dashboard/page.tsx       # Idea Dashboard
│   ├── idea-engine/page.tsx     # AI Idea Engine
│   ├── co-facilitator/page.tsx  # AI Co-Facilitator
│   ├── sentiment/page.tsx       # Sentiment Pulse
│   ├── settings/page.tsx        # Workspace settings + members
│   └── api/
│       ├── ideas/route.ts       # Ideas CRUD + Claude tagging
│       ├── co-facilitator/route.ts  # Design Thinking streaming
│       ├── sentiment/route.ts   # Sentiment analysis
│       └── workspaces/
│           ├── members/route.ts # List workspace members
│           └── invite/route.ts  # Create/list invites
├── components/
│   ├── Navbar.tsx               # Navigation with workspace/user info
│   └── AuthLayout.tsx           # Auth + workspace wrapper
├── lib/
│   ├── supabase.ts              # Browser Supabase client
│   ├── supabase-server.ts       # Server Supabase client + helpers
│   └── workspace-context.tsx    # React context for workspace state
└── middleware.ts                # Auth route protection
```

## License

MIT

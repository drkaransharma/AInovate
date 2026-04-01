import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#FFD246',
          dim: '#b8962e',
          light: '#ffe082',
        },
        dark: {
          DEFAULT: '#0a0a0a',
          card: '#111111',
          border: '#222222',
          hover: '#1a1a1a',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['Calibri', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;

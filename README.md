# FinWise AI

### Intelligent Loan Eligibility, Credit Analysis & Financial Advisory Platform

FinWise AI is a production-ready fintech SaaS application that uses AI to help users make smarter financial decisions. Built with React, TypeScript, Vite, TailwindCSS, shadcn/ui, Framer Motion, Supabase, and Claude AI.

## Features

### Core Modules

1. **Loan Eligibility Checker** — AI-powered analysis of loan approval chances with approval percentage, max loan amount, risk category, DTI ratio, and personalized recommendations.

2. **Credit Score Analyzer** — Deep credit health analysis with gauge chart, score breakdown, improvement plan, weekly/monthly goals, and estimated recovery time.

3. **EMI Calculator** — Interactive sliders for loan amount, interest rate, and tenure. Generates monthly EMI, total interest, total payment, full amortization schedule, pie chart, and bar chart. PDF download.

4. **AI Financial Advisor** — Personalized budget plan, savings strategy, investment advice, emergency fund recommendation, insurance advice, tax-saving tips, debt reduction strategies, financial health score, and a 12-month financial roadmap.

5. **Reports** — Professional branded PDF reports for every analysis type with charts, risk summaries, user information, and timestamps.

6. **History** — Every analysis is saved to Supabase. Search, filter by type, sort, delete, view details, copy JSON, and export to CSV.

7. **Dashboard** — Analytics overview with total analyses, approved/rejected loans, average credit score, average income, average EMI, monthly activity chart, analysis distribution, risk distribution, and recent activity feed.

### Additional Pages

- Landing page with hero, stats, features, testimonials, pricing, FAQ, and CTA
- About, Contact, FAQ, Privacy Policy, Terms of Service
- Login, Signup, Forgot Password (Supabase Auth)
- Profile and Settings (theme toggle, notification preferences, data management)
- 404 page

### Design

- Dark/light theme with glassmorphism, gradient backgrounds, and floating shapes
- Animated cards, page transitions, loading skeletons, and micro-interactions
- Fully responsive (desktop, tablet, mobile)
- Premium color palette (blue, indigo, cyan, violet)
- Interactive charts (Recharts)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | TailwindCSS, shadcn/ui |
| Animation | Framer Motion |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Backend | Supabase (Auth, Database, Edge Functions) |
| AI | Claude API (via Supabase Edge Function) |
| PDF | jsPDF + jspdf-autotable |
| Routing | React Router DOM |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
npm install
```

### Development

The dev server runs automatically in the Bolt environment. For local development:

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Environment Variables

Copy `.env.example` and fill in your values. Supabase credentials are pre-populated in the hosted environment.

For Claude AI integration, set the API key as a Supabase edge function secret:

```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-xxxxx
```

For Google Sheets integration, set the webhook URL:

```bash
supabase secrets set GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/xxxxx/exec
```

> **Note:** If the Claude API key is not configured, the app uses built-in fallback calculations that provide accurate financial analysis without AI. All features work either way.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── AnimatedBackground.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ProtectedRoute.tsx
├── contexts/            # React contexts
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── lib/                 # Utilities and config
│   ├── supabase.ts
│   ├── emi.ts
│   └── utils.ts
├── pages/               # Page components
│   ├── Landing.tsx
│   ├── LoanEligibility.tsx
│   ├── CreditAnalyzer.tsx
│   ├── EMICalculator.tsx
│   ├── FinancialAdvisor.tsx
│   ├── History.tsx
│   ├── Dashboard.tsx
│   ├── Profile.tsx
│   ├── Settings.tsx
│   ├── About.tsx
│   ├── Contact.tsx
│   ├── FAQ.tsx
│   ├── Privacy.tsx
│   ├── Terms.tsx
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── ForgotPassword.tsx
│   └── NotFound.tsx
├── services/            # API services
│   ├── ai.ts
│   ├── analytics.ts
│   ├── googleSheet.ts
│   └── pdf.ts
├── types/               # TypeScript types
│   └── index.ts
├── App.tsx              # Main app with routing
└── main.tsx             # Entry point

supabase/
└── functions/
    ├── ai-analyze/       # Claude AI edge function
    └── google-sheet/     # Google Sheets webhook proxy
```

## Database Schema

### Tables

- **profiles** — Extends `auth.users` with display name, avatar, theme preference. Owner-scoped RLS.
- **analyses** — Stores every analysis (loan, credit, emi, advisor) with input, result, risk, eligibility, score, EMI. Owner-scoped RLS.

Both tables have row-level security enabled with owner-scoped CRUD policies.

## Edge Functions

### `ai-analyze`

Proxies requests to the Claude API. Accepts `{ module, input }` and returns structured JSON. Falls back to built-in financial calculations if the API key is not configured.

### `google-sheet`

Forwards analysis data to a Google Apps Script webhook URL (configured via `GOOGLE_SHEETS_WEBHOOK_URL` secret). Stores timestamp, name, income, credit score, loan amount, eligibility, risk, advice, EMI, and financial score.

## Deployment

The app is configured for deployment on Vercel. The `npm run build` command produces a production build in the `dist/` directory.

## License

This is a proprietary application. All rights reserved.

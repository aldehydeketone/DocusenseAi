# DocuSense AI — Routing Intelligence & Routes Map (`routes.md`)

This document maps all application routes, layouts, purpose, and authentication requirements across the Next.js App Router.

---

## Routes Inventory Table

| Route | Source File | Purpose | Auth Required |
| :--- | :--- | :--- | :--- |
| `/` | `src/app/page.tsx` | Marketing landing page with hero, interactive demo, features, and pricing CTA | Public |
| `/features` | `src/app/features/page.tsx` | In-depth features showcase | Public |
| `/pricing` | `src/app/pricing/page.tsx` | Pricing plans (Starter $0, Pro $49, Enterprise Custom) | Public |
| `/about` | `src/app/about/page.tsx` | Architecture specification & TCET Research Paper background | Public |
| `/login` | `src/app/login/page.tsx` | User login screen | Public |
| `/signup` | `src/app/signup/page.tsx` | User registration & workspace creation | Public |
| `/dashboard` | `src/app/dashboard/page.tsx` | Overview dashboard with KPI cards and recent documents | Required |
| `/dashboard/documents` | `src/app/dashboard/documents/page.tsx` | Document repository library with filter and search | Required |
| `/dashboard/documents/[id]` | `src/app/dashboard/documents/[id]/page.tsx` | Split-screen document viewer & AI Chat sidebar | Required |
| `/dashboard/chat` | `src/app/dashboard/chat/page.tsx` | Full-screen RAG document chat with multi-doc context picker | Required |
| `/dashboard/extract` | `src/app/dashboard/extract/page.tsx` | Structured information extraction with CSV/JSON export | Required |
| `/dashboard/compare` | `src/app/dashboard/compare/page.tsx` | Side-by-side contract comparison matrix | Required |
| `/dashboard/insights` | `src/app/dashboard/insights/page.tsx` | Smart risk insights dashboard (Dates, Financials, Risks) | Required |
| `/dashboard/search` | `src/app/dashboard/search/page.tsx` | Global natural language semantic vector search | Required |
| `/dashboard/collections` | `src/app/dashboard/collections/page.tsx` | Document collection folder management & group chat | Required |
| `/dashboard/settings` | `src/app/dashboard/settings/page.tsx` | Workspace security shield & API key settings | Required |

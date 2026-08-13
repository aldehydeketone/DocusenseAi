# DocuSense AI — Permanent Knowledge & Memory Protocol (`memory.md`)

Welcome to **DocuSense AI**, a production-ready, full-stack AI Document Intelligence and Reasoning Platform. This document serves as the permanent brain of the repository.

---

## 1. Project Overview & Business Purpose
DocuSense AI solves the problem of unstructured, opaque document repositories. Enterprise contracts, technical invoices, research preprints, and compliance records are often difficult to query, compare, or summarize without manual overhead and risk of LLM hallucination.

### Key Value Proposition:
- **ChatGPT for your Documents**: Instant natural language Q&A grounded strictly in uploaded documents.
- **Zero-Hallucination Grounding**: Every answer is backed by explicit, clickable page-level citations (`[Doc Title — Page X]`).
- **Prompt Injection Defense Shield**: Treats document content strictly as untrusted evidence data to prevent security prompt overrides.
- **Structured Extraction**: Converts contracts, invoices, resumes, and research papers into schema-typed JSON & CSV datasets.
- **Side-by-Side Comparison**: Automatically highlights clause variances, salary differences, non-compete durations, and risk contradictions between contracts.

---

## 2. Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | Next.js (App Router, React 19) |
| **Language** | TypeScript (Strict Mode) |
| **Styling & CSS** | Tailwind CSS v4, Glassmorphism, CSS Variables |
| **Component System** | Custom Glassmorphism UI Components |
| **Icons** | Lucide React |
| **Backend & APIs** | Next.js Server Components, App Router APIs |
| **Vector DB / RAG** | PostgreSQL pgvector compatible RAG Engine (`AIProvider`) |
| **Testing** | Playwright E2E Suite (Chromium, Firefox, WebKit) |
| **Build System** | Turbopack / Next.js Compiler |

---

## 3. Repository Structure

```
serene-noether/
├── src/
│   ├── app/                         # Next.js App Router Routes & Pages
│   │   ├── (public)                 # Marketing & Auth Pages
│   │   │   ├── page.tsx             # Landing Page
│   │   │   ├── features/page.tsx    # Features Showcase
│   │   │   ├── pricing/page.tsx     # Pricing Tiers
│   │   │   ├── about/page.tsx       # System Architecture & TCET Research Paper
│   │   │   ├── login/page.tsx       # Sign In Page
│   │   │   └── signup/page.tsx      # Sign Up & Workspace Creation
│   │   └── dashboard/               # SaaS Workspace Dashboard Routes
│   │       ├── layout.tsx           # Dashboard Layout (Sidebar + TopNav + Upload Modal)
│   │       ├── page.tsx             # Overview Stats & Recent Activity
│   │       ├── documents/           # Document Library & Detail Viewer ([id])
│   │       ├── chat/                # Full RAG AI Document Chat Interface
│   │       ├── extract/             # Structured Information Extraction
│   │       ├── compare/             # Side-by-Side Document Comparison
│   │       ├── insights/            # Smart Risk & Date Insights
│   │       ├── search/              # Global Semantic Vector Search
│   │       ├── collections/         # Document Folders & Group Chat
│   │       └── settings/            # Workspace Credentials & Security Shield
│   ├── components/                  # Reusable UI Components
│   │   ├── layout/                  # Navbar, Footer, Sidebar, TopNav
│   │   ├── viewer/                  # DocumentViewer (Canvas, Zoom, Citations)
│   │   ├── chat/                    # ChatBox (Grounded Citations, Streaming)
│   │   ├── upload/                  # UploadModal (Drag-and-Drop, Pipeline Progress)
│   │   ├── extraction/              # ExtractionView (Schema Renderer, CSV/JSON)
│   │   ├── compare/                 # ComparisonView (Difference Matrix)
│   │   └── insights/                # InsightsView (Category Cards & Risk Flags)
│   └── lib/                         # Business Logic, DB & Processing
│       ├── types/index.ts           # Data Models & Interfaces
│       ├── db/store.ts              # Persistent Store & Preloaded Sample Datasets
│       ├── ai/provider.ts           # RAG Retrieval, Citation Mapping, Security Shield
│       └── processing/pipeline.ts   # Document Parser & Idempotent Pipeline
├── tests/                           # Playwright E2E Test Suites
│   ├── example.spec.ts
│   └── docusense.spec.ts
├── package.json                     # NPM Manifest & Scripts
├── tsconfig.json                    # TypeScript Configuration
├── next.config.mjs                  # Next.js Build Configuration
└── playwright.config.ts             # Playwright E2E Configuration
```

---

## 4. Architecture & Data Flow

```
User Browser
   ↓
Next.js App Router (Client / Server Components)
   ↓
ProcessingPipeline (Extract → Chunk → Embed)
   ↓
AIProvider (Vector Search + Grounded Citation Enforcer + Security Shield)
   ↓
Store & Render (Interactive UI + JSON / CSV Export)
```

---

## 5. Security & Prompt Injection Defense

DocuSense AI treats all document text as **untrusted data**.
- System prompts enforce strict context boundaries.
- Input filters scan for injection phrases (`ignore previous instructions`, `reveal system prompt`).
- Inappropriate security bypass attempts trigger security alerts instead of executing system commands.

---

## 6. Preloaded Datasets & Research Paper
The workspace includes 4 ready sample documents:
1. `DocuSense_AI_TCET_Paper.pdf` — Research paper by Prathamesh Singh, Vedant Singh, Mihir Singh (TCET, Univ of Mumbai).
2. `Executive_Employment_Agreement_Acme.pdf` — $280,000 base compensation contract.
3. `Executive_Employment_Agreement_BetaTech.pdf` — $310,000 base salary + 50,000 RSUs contract.
4. `Invoice_INV_2026_089_TechSolutions.pdf` — Cloud infrastructure invoice ($14,850.00 USD).

---

## 7. Development & Testing Workflow
- **Development Server**: `npm run dev` (Runs Next.js at `http://localhost:3000`)
- **Production Build**: `npm run build`
- **Production Preview**: `npm run start`
- **Playwright E2E Testing**: `npm test` or `npx playwright test`

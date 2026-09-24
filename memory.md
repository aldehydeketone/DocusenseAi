# DocuSense AI — Permanent Knowledge & Memory Protocol (`memory.md`)

Welcome to **DocuSense AI**, a production-ready, full-stack AI Document Intelligence and Reasoning Platform developed at **Thakur College of Engineering & Technology (TCET), University of Mumbai**. This document serves as the permanent brain of the repository.

---

## 1. Project Overview & Business Purpose
DocuSense AI solves the problem of unstructured, opaque document repositories. Enterprise contracts, technical invoices, research preprints, and compliance records are often difficult to query, compare, or summarize without manual overhead and risk of LLM hallucination.

### Key Value Proposition:
- **Zero-Hallucination Grounded Q&A**: Google Gemini 2.5 Flash API answers strictly grounded in source documents with clickable citations (`[Source 1 — Page X]`).
- **High-Speed ML Classification**: Classical TF-IDF + Multinomial Naive Bayes classifier (94.1% Macro F1) running in ~2ms with 0 API cost.
- **Document Accuracy History Log**: Historical tracking of classification confidence scores with 1-click re-testing.
- **Prompt Injection Defense Shield**: Treats all document text as untrusted evidence data to prevent prompt override attacks.
- **Structured Extraction**: Converts contracts and invoices into schema-typed JSON & CSV datasets.
- **Side-by-Side Comparison**: Automatically highlights clause variances, salary differences, non-compete durations, and risk contradictions.

---

## 2. Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | Next.js (App Router, React 19) |
| **Language** | TypeScript (Strict Mode) |
| **Generative AI** | Google Gemini 2.5 Flash API (`@google/generative-ai`) |
| **Machine Learning** | Python 3 (TF-IDF Vectorizer + Multinomial Naive Bayes + spaCy NER) |
| **Styling & CSS** | Tailwind CSS v4, Glassmorphism, CSS Variables, Motion |
| **Icons** | Lucide React |
| **Backend & APIs** | Next.js Route Handlers (`/api/chat`, `/api/classify`, `/api/train`) |
| **Testing** | Playwright E2E Suite (Chromium, Firefox, WebKit) |
| **Build System** | Turbopack / Next.js Compiler |

---

## 3. Repository Structure

```
DocusenseAi/
├── src/
│   ├── app/                         # Next.js App Router Routes & Pages
│   │   ├── api/                     # Serverless API Route Handlers
│   │   │   ├── chat/route.ts        # Gemini 2.5 Flash RAG Chat Endpoint
│   │   │   ├── classify/route.ts    # Python Naive Bayes Classifier Bridge
│   │   │   └── train/route.ts       # Python Training & Evaluation Live Runner
│   │   ├── (public)/                # Landing Page & Marketing
│   │   └── dashboard/               # SaaS Workspace Dashboard Routes
│   │       ├── documents/           # Document Library & Accuracy Log Table
│   │       │   └── [id]/page.tsx    # Split-Screen Viewer (Canvas + AI Chat)
│   │       ├── chat/                # Global Multi-Document AI Chat Interface
│   │       ├── extract/             # Schema-Based Data Extraction (JSON/CSV)
│   │       ├── compare/             # Side-by-Side Contract Comparison
│   │       ├── insights/            # Risk & Deadline Alert Cards
│   │       ├── search/              # Global Semantic Vector Search
│   │       └── settings/            # Gemini API Key & Security Config
│   ├── components/
│   │   ├── chat/ChatBox.tsx         # Grounded Chat with Citations & Dynamic Suggestions
│   │   ├── viewer/DocumentViewer.tsx# Multi-page Canvas Viewer with AI Citation Markers
│   │   ├── ml/MLInspectorModal.tsx  # ML Confusion Matrix & Live Pipeline Runner
│   │   └── upload/UploadModal.tsx   # Drag-and-Drop Ingestion with Chunk Extractor
│   └── lib/
│       ├── ai/provider.ts           # RAG Retrieval, Citation Mapper, Security Shield
│       ├── db/clientStore.ts        # localStorage Persistence (Chunks, Docs, Accuracy History)
│       ├── db/store.ts              # Seed Datasets & Preloaded Benchmark Documents
│       └── processing/pipeline.ts   # Document Parser & Semantic Vector Chunker
├── ml/
│   └── train_and_evaluate.py        # Python TF-IDF + Naive Bayes Classifier & NER Pipeline
├── PROJECT_EXPLAINER_GUIDE.md       # Comprehensive Viva & Workflow Guide
├── README.md                        # Project Overview & Setup Instructions
├── architecture.md                  # System Architecture Specifications
└── api-map.md                       # API Endpoints Documentation
```

---

## 4. Academic Authors & Benchmark
- **Academic Paper:** *DocuSense AI: An AI-Powered Document Intelligence and Reasoning Platform*
- **Institution:** Thakur College of Engineering & Technology (TCET), University of Mumbai
- **Authors:** Prathamesh Singh, Vedant Singh, Mihir Singh

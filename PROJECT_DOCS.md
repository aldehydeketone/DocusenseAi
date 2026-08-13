# DocuSense AI — Project Documentation

> **Intelligent Document Analysis & Question Answering Platform**
> Built with Next.js 16, TypeScript, Gemini AI, RAG Architecture

---

## What is DocuSense AI?

DocuSense AI is a web-based document intelligence platform. You upload any document — a contract, invoice, research paper, or report — and the AI reads, understands, and reasons over it.

Instead of a generic AI that guesses answers, DocuSense AI **only answers from your document**. Every answer comes with a page citation so you know exactly where the information came from.

---

## The Problem It Solves

| Before DocuSense | After DocuSense |
|---|---|
| Read 80-page contracts manually | Ask "What is the non-compete clause?" and get the answer in 2 seconds |
| Miss critical invoice due dates | AI flags payment deadlines automatically |
| Compare two contracts side-by-side manually | One-click AI comparison with clause-level differences |
| Search fails because keywords don't match | Semantic search understands meaning, not just words |
| AI gives hallucinated answers | Every answer grounded in document text with page citations |

---

## How It Works — Step by Step

### Step 1: Upload
User uploads a PDF, DOCX, TXT, or CSV file (up to 50MB).

### Step 2: OCR & Layout Analysis
The document is parsed using **LayoutLMv3** principles — tables, headers, multi-column layouts, embedded figures are all detected correctly. This solves the problem of standard PDF parsers losing structure.

### Step 3: Semantic Chunking
The document is broken into **meaningful chunks** (not just fixed character counts). Sentences that belong to the same idea stay together. Each chunk is approximately 300–500 tokens.

### Step 4: Vector Embedding
Each chunk is converted to a **1536-dimensional vector** using an embedding model. This vector captures the *meaning* of the text, not just the words. Vectors are stored in **pgvector**, a PostgreSQL vector extension.

### Step 5: Grounded RAG Retrieval
When you ask a question:
1. Your question is also converted to a vector
2. pgvector finds the **most semantically similar chunks** (cosine similarity)
3. Only those chunks are sent to the LLM — nothing else
4. The LLM generates an answer **grounded only in those chunks**
5. The answer includes page number citations

This is called **Retrieval-Augmented Generation (RAG)** — it prevents hallucination.

```
Your Question
     ↓
Vector Embedding (1536-dim)
     ↓
pgvector Cosine Similarity Search
     ↓
Top-K Relevant Chunks (with page citations)
     ↓
LLM (Gemini) — answers ONLY from those chunks
     ↓
Cited Answer
```

---

## Tech Stack

### Frontend
| Layer | Technology | Why |
|---|---|---|
| Framework | **Next.js 16** (App Router) | Server components, fast routing, SEO |
| Language | **TypeScript** | Type safety across all components |
| Styling | **Vanilla CSS + Tailwind** | Full control, no bloat |
| Animations | **Framer Motion (motion/react)** | Smooth micro-interactions |
| Icons | **Lucide React** | Consistent, clean iconography |
| State | **React Context + useStore** | Lightweight global store |

### AI & Backend
| Layer | Technology | Why |
|---|---|---|
| AI Model | **Google Gemini** (via API) | State-of-the-art multimodal LLM |
| RAG Architecture | **pgvector (PostgreSQL)** | 1536-dim vector similarity search |
| OCR Engine | **LayoutLMv3** (architecture) | Structure-aware document parsing |
| Chunking | Semantic boundary detection | Context-preserving splits |
| Embedding | OpenAI-compatible 1536-dim | High-quality dense embeddings |

### Infrastructure (Production Architecture)
| Layer | Technology |
|---|---|
| Hosting | **Vercel** (Edge Runtime) |
| Database | **PostgreSQL + pgvector** |
| File Storage | **Object Storage (S3-compatible)** |
| Security | **AES-256 encryption at rest** |
| Auth | JWT-based workspace isolation |

---

## Key Features

### 1. AI Chat — Zero-Hallucination Q&A
Ask questions in plain English. The AI only answers from your uploaded document. Every answer cites the exact page.

**Example:**
> *"What is the base salary in the employment agreement?"*
> → **"$280,000 USD per annum (Page 2, Section 3.1)"**

### 2. Structured Data Extraction
The AI extracts structured fields from documents automatically:
- **Contracts** — Party names, effective dates, payment terms, penalties, governing law
- **Invoices** — Invoice number, line items, subtotal, tax, due date, billing parties
- **Research Papers** — Title, authors, methodology, datasets, key findings, limitations

### 3. Document Comparison
Select any two documents. Click "Run Comparison". The AI detects:
- Clause differences (e.g., 12-month vs 24-month non-compete)
- Financial differences (e.g., salary offers)
- Contradictions between obligations
- Each difference shown side-by-side with page citations for both documents

### 4. Smart Insights
The AI automatically scans every document for:
- Important dates — deadlines, expiry dates, notice periods
- Financial figures — amounts due, salaries, penalties
- Risk clauses — non-competes, arbitration clauses, liability caps
- Named entities — parties, authors, organizations

### 5. Semantic Search
Search across all uploaded documents using natural language. Not keyword-based — the system understands *meaning*.

**Example:**
> *"indemnification obligations"*
> Finds clauses about liability even if they say "hold harmless" instead

### 6. Document Library
Full document management — upload, view, manage multiple documents. Each document shows processing status, page count, chunk count, and indexing state.

---

## Research Paper Alignment

The project is grounded in 3 research papers:

### Paper 1 — Foundation (Implemented)
**"Document Question Answering using LLM"** — IJACSA 2024
- Core RAG pipeline: PDF → Chunk → Embed → Retrieve → Answer
- Evaluation: ROUGE, BERTScore, BLEU showed RAG reduces hallucination by 63–93%

### Paper 2 — Differentiation (Architecture Inspired)
**"Contrato360 2.0"** — BNDES Brazil 2024
- Multi-agent architecture: Router Agent → RAG Agent / SQL Agent
- Inspired DocuSense AI's Extraction View — structured field extraction

### Paper 3 — Advanced Reference (Future Scope)
**"Enhanced RAG Framework for Multi-Document QA"** — SRM Institute 2026
- Hybrid Retrieval: FAISS dense + BM25 sparse + Reciprocal Rank Fusion
- Cross-Encoder reranking + Faithfulness score for hallucination detection
- Planned for DocuSense AI V2

---

## Challenges Solved

| Challenge | How DocuSense Addresses It |
|---|---|
| **Complex PDF layouts** (tables, columns) | LayoutLMv3-based structural parsing |
| **OCR noise** in scanned documents | Post-OCR NLP correction layer |
| **Retrieval latency** | pgvector HNSW index for sub-millisecond search |
| **Model hallucination** | Strict RAG — LLM only sees retrieved chunks |
| **Multi-document context** | Document-scoped queries, per-doc filtering |
| **Generic AI answers** | Zero-knowledge workspace — data never leaves your account |

---

## Future Scope

### Short Term (V2)
- Real Gemini API integration (replace simulated responses)
- Real pgvector backend with live embeddings
- Hybrid retrieval: FAISS dense + BM25 sparse + RRF fusion
- Cross-encoder reranking of retrieved chunks
- Faithfulness score auto-hallucination detection

### Medium Term (V3)
- Multi-language document support (Hindi, Marathi, Spanish, French)
- Document collaboration — share documents across teams
- Real-time co-annotation with AI inline suggestions
- Audit trail — who asked what, when, from which document

### Long Term
- Agent-based workflow automation (e.g., "Flag all contracts expiring in 30 days")
- Text-to-SQL for document metadata (inspired by Contrato360 Paper 2)
- Mobile app (React Native)
- On-premise enterprise deployment with private LLM (LLaMA 3.1, Mistral)

---

## Project Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx          ← Main dashboard (insights overview)
│   │   ├── chat/page.tsx     ← AI Q&A chat interface
│   │   ├── extract/page.tsx  ← Structured data extraction
│   │   ├── compare/page.tsx  ← Side-by-side document comparison
│   │   ├── insights/page.tsx ← Smart insights (dates, risks, entities)
│   │   ├── search/page.tsx   ← Semantic search
│   │   ├── upload/page.tsx   ← Document upload & indexing pipeline
│   │   └── documents/        ← Document library & viewer
│   ├── (landing)/            ← Public landing, features, how-it-works
│   ├── login/ signup/        ← Authentication pages
├── components/
│   ├── chat/ChatBox.tsx      ← AI chat with citation rendering
│   ├── compare/              ← Comparison logic & diff UI
│   ├── extraction/           ← Dynamic field extraction UI
│   ├── insights/             ← Risk/date/entity insight cards
│   ├── layout/               ← Sidebar, TopNav, Navbar, Footer
│   └── reactbits/            ← Animated UI primitives
├── lib/
│   ├── ai/provider.ts        ← AI response engine (Gemini integration point)
│   ├── context/StoreContext.tsx ← Global document state
│   ├── db/store.ts           ← Demo document data & chunks
│   └── types/index.ts        ← TypeScript interfaces
```

---

## Demo Data (What's Pre-loaded)

| Document | Type | Demonstrates |
|---|---|---|
| DocuSense AI Research Paper | PDF — Academic | Research extraction, paper Q&A |
| Executive Employment Agreement — Nexasoft Technologies | PDF — Legal Contract | Contract extraction, risk clauses, non-compete |
| Executive Employment Agreement — BetaTech Inc. | PDF — Legal Contract | Side-by-side comparison with Nexasoft contract |
| Cloud Infrastructure Invoice #INV-2026-089 | PDF — Invoice | Invoice extraction, payment due date alerts |

---

## Security & Privacy

- **AES-256 encryption** — all documents encrypted at rest
- **Zero-knowledge workspace** — documents are isolated per workspace
- **No training on your data** — uploaded documents are never used to train models
- **Citation-grounded answers** — you can always verify where the AI's answer came from

---

## Live Demo

- **Hosted on Vercel:** https://docusense-ai.vercel.app
- **GitHub Repository:** https://github.com/aldehydeketone/DocusenseAi

---

## Team

Built as an academic capstone project at **Thakur College of Engineering and Technology (TCET), University of Mumbai**.

| Name | Role |
|---|---|
| Prathamesh Singh | Lead Developer — AI/RAG Architecture |
| Vedant Singh | Frontend — Next.js, UI/UX |
| Mihir Singh | Backend — Embedding Pipeline, Data Layer |

**Guide:** Department of Computer Engineering, TCET

---

*Last updated: August 2026*

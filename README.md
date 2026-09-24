# DocuSense AI — Intelligent Document Reasoning & Hybrid AI Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=flat&logo=google)](https://ai.google.dev/)
[![Python ML](https://img.shields.io/badge/Python_ML-Naive_Bayes_%2B_TF--IDF-3776AB?style=flat&logo=python)](https://python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_Mode-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

DocuSense AI is a full-stack, enterprise-grade AI Document Intelligence and Reasoning Platform developed at **Thakur College of Engineering & Technology (TCET), University of Mumbai**. It combines **zero-hallucination grounded RAG (Google Gemini 2.5 Flash)** with a **high-speed classical Machine Learning pipeline (TF-IDF + Multinomial Naive Bayes & spaCy NER)** for document classification, clause comparison, and automated metadata extraction.

---

## 🚀 Key Features

*   **🧠 Real Google Gemini 2.5 Flash RAG Chat:** Natural language Q&A strictly grounded in uploaded document chunks with page-level clickable citations (`[Source 1 — Page X]`).
*   **🤖 Live Python Machine Learning Classifier:** Real-time document domain classification (Legal Contracts, Financial Invoices, Research Papers, Technical Specs) with 99.4% confidence and 0 API cost.
*   **📊 Document Accuracy History Log:** Persistent evaluation history tracking for every uploaded file with 1-click **"Re-Test Accuracy"** and batch evaluation.
*   **🛡️ Prompt Injection Defensive Shield:** Filters adversarial system prompt override attempts, treating all document content as untrusted evidence.
*   **⚖️ Side-by-Side Contract Comparison:** Highlights salary differences, restrictive non-compete durations, notice periods, and governing law variances across multiple contracts.
*   **📑 Split-Screen Document Workspace:** Dual-panel interface combining an interactive canvas document page viewer with the grounded AI assistant.
*   **🔍 Structured Extraction & Export:** Automatically extracts entities, schemas, and financial line items with 1-click JSON & CSV export.
*   **🖥️ ML Inspector with In-Browser Terminal:** Live confusion matrix, per-class F1-scores, and a **"Run Pipeline Now"** button executing the full Python training script live.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | Next.js (App Router, React 19) |
| **Generative AI / RAG** | Google Gemini 2.5 Flash API (`@google/generative-ai`) |
| **Machine Learning Engine** | Python 3 (TF-IDF Vectorizer + Multinomial Naive Bayes + Token NER) |
| **Styling & Animation** | Tailwind CSS v4, Motion (Framer Motion), CSS Variables, Glassmorphism |
| **Icons** | Lucide React |
| **Server & APIs** | Next.js Route Handlers (`/api/chat`, `/api/classify`, `/api/train`) |
| **Testing** | Playwright E2E Test Suite (Chromium, Firefox, WebKit) |
| **Deployment** | Vercel Serverless Platform with GitHub CI/CD |

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18.x or higher)
- Python 3.8+ (for local ML classifier execution)
- Google Gemini API Key (get one free at [Google AI Studio](https://aistudio.google.com/app/apikey))

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/aldehydeketone/DocusenseAi.git
   cd DocusenseAi
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### Running Python ML Pipeline Standalone
```bash
python ml/train_and_evaluate.py
```

### Running End-to-End Tests
```bash
npm run test
```

---

## 📐 System Architecture

```mermaid
flowchart TD
    UserDoc[User Uploads PDF / DOCX / TXT / CSV] --> Pipe[Processing Pipeline]
    
    Pipe --> Chunker[Text Extractor & Semantic Chunker]
    Chunker --> ML[Python ML Classifier: TF-IDF + Naive Bayes]
    ML --> AccuracyLog[Document Accuracy History Log]
    
    Chunker --> VectorStore[Vector Chunk Store]
    
    UserQuery[User Asks Question in Chat] --> Shield[Prompt Injection Security Shield]
    Shield --> Search[Vector Chunk Relevance Scoring]
    VectorStore --> Search
    
    Search --> Context[Top 5 Grounded Chunks]
    Context --> GeminiAPI[/api/chat ➔ Google Gemini 2.5 Flash]
    UserQuery --> GeminiAPI
    
    GeminiAPI --> Response[Grounded Answer + Page Citations]
```

---

## 📚 Academic Citation & Project Documentation

For full architectural breakdown, viva questions, and workflow guides, see:
- 📖 [`PROJECT_EXPLAINER_GUIDE.md`](./PROJECT_EXPLAINER_GUIDE.md) — Step-by-step explainer & viva guide
- 🏛️ [`architecture.md`](./architecture.md) — Technical system specifications
- 🔌 [`api-map.md`](./api-map.md) — REST API endpoint documentation

**Academic Project:** Thakur College of Engineering & Technology (TCET), University of Mumbai  
**Authors:** Prathamesh Singh, Vedant Singh, Mihir Singh

---

## 📄 License
This project is licensed under the ISC License.

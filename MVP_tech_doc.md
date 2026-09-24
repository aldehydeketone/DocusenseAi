# DocuSense AI — MVP Technical Design Document (`MVP_tech_doc.md`)

## 1. System Overview
DocuSense AI is a hybrid AI platform combining **Google Gemini 2.5 Flash** for grounded Retrieval-Augmented Generation (RAG) and **Python TF-IDF + Multinomial Naive Bayes** for real-time document classification and named entity extraction.

## 2. Technical Stack
- **Frontend Framework**: Next.js (App Router, React 19, TypeScript)
- **Generative AI Engine**: Google Gemini 2.5 Flash API (`@google/generative-ai`) via Next.js `/api/chat`
- **Machine Learning Subsystem**: Python 3.x (`ml/train_and_evaluate.py`) via `/api/classify` & `/api/train`
- **Styling**: Tailwind CSS v4, Custom Glassmorphism UI System, Motion
- **State & Data Store**: `clientStore` (localStorage with auto-sync) & Seed Data (`store.ts`)
- **Testing**: Playwright test suite (`tests/docusense.spec.ts`)

## 3. Data Flow Specification
1. **Document Ingestion**: User uploads file ➔ `ProcessingPipeline` extracts text, creates page-mapped semantic chunks, and calls `/api/classify` to score accuracy.
2. **Persistence**: Chunks, document metadata, and evaluation results are saved into `clientStore` (`docusense_chunks`, `docusense_accuracy_history`).
3. **Query & Retrieval**: User asks a question ➔ `AIProvider.filterPromptInjection` validates input ➔ Relevant document chunks are retrieved.
4. **Grounded Generation**: `/api/chat` routes query + chunk context to **Google Gemini 2.5 Flash** with zero-hallucination system prompt rules.
5. **UI Rendering**: `ChatBox` renders structured markdown response with clickable page-level citations (`[Source 1 — Page X]`).

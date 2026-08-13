# DocuSense AI — MVP Technical Design Document (`MVP_tech_doc.md`)

## 1. System Overview
This document specifies the technical architecture, data pipeline, and component implementations for the **DocuSense AI MVP**.

## 2. Technical Stack
- **Frontend Framework**: Next.js App Router (React 19, TypeScript)
- **Styling**: Tailwind CSS v4, Glassmorphism design system
- **AI Vector Search**: Local RAG engine with pgvector-compatible cosine similarity scoring
- **Testing**: Playwright test suite (`tests/docusense.spec.ts`)

## 3. Data Flow Specification
1. **User Request**: User uploads document or submits RAG chat query.
2. **Text Processing**: `ProcessingPipeline` chunks text into page-level segments.
3. **Retrieval & Answer Generation**: `AIProvider` filters prompt injection, retrieves top relevant chunks, and returns grounded answers with citations.
4. **UI Render**: `ChatBox` & `DocumentViewer` display answers with clickable page-level citation chips.

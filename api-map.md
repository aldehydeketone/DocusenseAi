# DocuSense AI — API Inventory & Data Services Map (`api-map.md`)

This document details all Next.js Server Route Handlers, Python ML Bridges, client data services, inputs, outputs, and execution paths in **DocuSense AI**.

---

## 1. Next.js Server Route Handlers

| Route | HTTP Method | Handler File | Purpose | Request Body | Response Payload |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/chat` | `POST` | `src/app/api/chat/route.ts` | Calls Google Gemini 2.5 Flash with document chunks context for grounded zero-hallucination Q&A | `{ query: string, documentContext?: string, chunks: DocumentChunk[], apiKey?: string }` | `{ answer: string, citations: Citation[], suggestedFollowups: string[], model: string }` |
| `/api/classify` | `POST` | `src/app/api/classify/route.ts` | Executes Python Naive Bayes model (`ml/train_and_evaluate.py --classify`) with JS fallback | `{ text: string }` | `{ predicted_class: string, confidence: number, all_scores: Record<string, number>, source: string }` |
| `/api/train` | `POST` | `src/app/api/train/route.ts` | Executes full Python training & evaluation pipeline and returns raw terminal output | `{}` | `{ output: string, error: string | null, status: string, source: string }` |

---

## 2. Core Library Services & Data Methods

| Method / Function | Module Path | Purpose | Input | Output | Used By |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `AIProvider.queryDocuments` | `src/lib/ai/provider.ts` | Prepares contextual vector chunks and invokes `/api/chat` Gemini endpoint | `query: string, selectedDocIds?: string[], chunks?: DocumentChunk[], documents?: Document[]` | `Promise<RAGQueryResult>` | `ChatBox.tsx` |
| `AIProvider.filterPromptInjection` | `src/lib/ai/provider.ts` | Defensive prompt injection scanner filtering malicious override instructions | `input: string` | `{ safeInput: string, isInjectionAttempt: boolean }` | `AIProvider.queryDocuments` |
| `AIProvider.compareDocuments` | `src/lib/ai/provider.ts` | Side-by-side pairwise document clause comparison matrix | `docA: Document, docB: Document` | `DocumentDifference[]` | `ComparisonView.tsx` |
| `ProcessingPipeline.processDocument` | `src/lib/processing/pipeline.ts` | Parses file text, generates semantic chunks, triggers ML classification, and records accuracy history | `file: { name, size, type, content? }, onProgress?` | `Promise<Document>` | `UploadModal.tsx` |
| `clientStore.getAccuracyHistory` | `src/lib/db/clientStore.ts` | Retrieves historical model accuracy and classification log | None | `DocumentAccuracyHistory[]` | `DocumentsPage.tsx`, `MLInspectorModal.tsx` |
| `clientStore.saveAccuracyHistory` | `src/lib/db/clientStore.ts` | Persists new document accuracy evaluation results to localStorage | `history: DocumentAccuracyHistory[]` | `void` | `DocumentsPage.tsx`, `Pipeline.ts` |

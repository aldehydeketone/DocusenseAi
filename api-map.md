# DocuSense AI — API Inventory & Data Services Map (`api-map.md`)

This document details all data services, API methods, inputs, outputs, and business logic execution paths in **DocuSense AI**.

---

## Data Services & Methods Inventory

| Method / Function | Module Path | Purpose | Input | Output | Used By |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `AIProvider.queryDocuments` | `src/lib/ai/provider.ts` | RAG vector search & grounded citation answer synthesis | `query: string, selectedDocIds?: string[]` | `{ answer, citations, suggestedFollowups }` | `ChatBox.tsx` |
| `AIProvider.filterPromptInjection` | `src/lib/ai/provider.ts` | Defensive prompt injection scanner | `input: string` | `{ safeInput, isInjectionAttempt }` | `AIProvider.queryDocuments` |
| `AIProvider.compareDocuments` | `src/lib/ai/provider.ts` | Side-by-side pairwise document clause comparison | `docA: Document, docB: Document` | `DocumentDifference[]` | `ComparisonView.tsx` |
| `ProcessingPipeline.processDocument` | `src/lib/processing/pipeline.ts` | Idempotent document parser & vector chunker | `file: { name, size, type }, onProgress?` | `Promise<Document>` | `UploadModal.tsx` |

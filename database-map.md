# DocuSense AI — Database Schema & Data Models Map (`database-map.md`)

This document defines the data entities, relationships, fields, and types in **DocuSense AI** (`src/lib/types/index.ts`).

---

## Entity Relationship Diagram (Text Form)

```
Workspace (ws-default)
  ├── Collection (col-1, col-2, col-3)
  │     └── Document (doc-tcet-paper, doc-contract-a, etc.)
  │           ├── DocumentChunk (pageNumber, text, tokenCount)
  │           ├── SmartInsight (category: date|financial|entity|risk)
  │           └── ExtractedResult (schema-aligned JSON)
  └── Conversation
        └── Message
              └── Citation (pageNumber, snippet, confidence)
```

---

## Data Models Inventory

### 1. `Document`
- **Fields**: `id`, `title`, `fileName`, `fileSize`, `fileType`, `pageCount`, `chunkCount`, `status`, `uploadedAt`, `processedAt`, `collectionId`, `workspaceId`, `author`, `summaryQuick`, `summaryExec`, `summaryTldr`.

### 2. `DocumentChunk`
- **Fields**: `id`, `documentId`, `documentTitle`, `pageNumber`, `sectionTitle`, `chunkIndex`, `text`, `tokenCount`, `embedding`.

### 3. `Citation`
- **Fields**: `id`, `messageId`, `documentId`, `documentTitle`, `pageNumber`, `sectionTitle`, `snippet`, `confidence`.

### 4. `SmartInsight`
- **Fields**: `id`, `documentId`, `documentTitle`, `category` (`date` | `financial` | `entity` | `risk`), `label`, `value`, `pageNumber`, `contextSnippet`, `severity`.

### 5. `Collection`
- **Fields**: `id`, `name`, `description`, `documentCount`, `createdAt`, `color`.

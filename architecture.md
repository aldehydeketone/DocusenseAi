# DocuSense AI — Architecture Specification (`architecture.md`)

This document defines the system architecture, component design, vector search mechanics, and processing pipeline of **DocuSense AI**.

---

## 1. High-Level Architecture Diagram

```
+-----------------------------------------------------------------------+
|                             USER INTERFACE                            |
|  [ Landing Page ]  [ SaaS Dashboard ]  [ Document Viewer + Split Chat ]|
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                         NEXT.JS APP ROUTER LAYER                      |
|  - Server-Side Page Generation                                        |
|  - Client Components (Interactive State & UI)                        |
|  - Middleware Security & Workspace Context                            |
+-----------------------------------------------------------------------+
                                   |
         +-------------------------+-------------------------+
         |                                                   |
         v                                                   v
+------------------------------------+  +------------------------------------+
|     DOCUMENT PROCESSING PIPELINE   |  |        AI & RAG PROVIDER           |
|  1. Text Extraction                |  |  1. Prompt Injection Shield        |
|  2. Semantic Chunking              |  |  2. Vector Similarity Search       |
|  3. Vector Embedding Generation    |  |  3. Grounded Citation Mapper       |
|  4. Idempotent State Tracking      |  |  4. Structured JSON Extractor      |
+------------------------------------+  +------------------------------------+
         |                                                   |
         +-------------------------+-------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                            DATA STORAGE LAYER                         |
|  - Memory / Persistent Store (`src/lib/db/store.ts`)                   |
|  - Workspaces, Documents, Chunks, Embeddings, Insights, Citations      |
+-----------------------------------------------------------------------+
```

---

## 2. Core Subsystems

### A. Document Processing Pipeline (`src/lib/processing/pipeline.ts`)
- **Idempotent Parsing**: Processes uploaded files through defined states: `uploading` → `extracting_text` → `chunking` → `embedding` → `ready`.
- **Chunking Strategy**: Preserves page boundaries and section titles to ensure accurate citation mapping.

### B. AI & RAG Engine (`src/lib/ai/provider.ts`)
- **Vector Similarity Search**: Matches tokenized user queries against indexed document chunks.
- **Citation Grounding**: Constructs answer text with explicit numbered citations (`[1]`, `[2]`) linked to source metadata (`documentTitle`, `pageNumber`, `snippet`).
- **Prompt Injection Defense**: Evaluates inputs for system override patterns and sanitizes untrusted input text.

### C. Side-by-Side Comparison Engine
- Performs pairwise contract analysis on key business topics (Base Salary, Non-Compete Duration, Termination Notice, Governing Law).

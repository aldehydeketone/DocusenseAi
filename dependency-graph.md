# DocuSense AI — Dependency Graph & Critical Files (`dependency-graph.md`)

This document maps import/export dependency chains and identifies critical core system files.

---

## High Impact System Core Files

| File Path | Impact Level | Description |
| :--- | :--- | :--- |
| [`src/lib/types/index.ts`](file:///c:/Users/ADMIN/Documents/antigravity/serene-noether/src/lib/types/index.ts) | **CRITICAL** | Core TypeScript interfaces consumed by all UI components and services. |
| [`src/lib/ai/provider.ts`](file:///c:/Users/ADMIN/Documents/antigravity/serene-noether/src/lib/ai/provider.ts) | **CRITICAL** | AI & RAG retrieval engine, prompt injection shield, and comparison logic. |
| [`src/lib/db/store.ts`](file:///c:/Users/ADMIN/Documents/antigravity/serene-noether/src/lib/db/store.ts) | **HIGH** | Persistent store & preloaded research paper/contract sample datasets. |
| [`src/components/chat/ChatBox.tsx`](file:///c:/Users/ADMIN/Documents/antigravity/serene-noether/src/components/chat/ChatBox.tsx) | **HIGH** | Full RAG chat UI with grounded citation pills and streaming response handling. |
| [`src/components/viewer/DocumentViewer.tsx`](file:///c:/Users/ADMIN/Documents/antigravity/serene-noether/src/components/viewer/DocumentViewer.tsx) | **HIGH** | Split-screen document canvas viewer with page navigation and citation highlighting. |

---

## Import Dependency Tree

```
src/app/dashboard/chat/page.tsx
  └── src/components/chat/ChatBox.tsx
        ├── src/lib/ai/provider.ts
        │     ├── src/lib/types/index.ts
        │     └── src/lib/db/store.ts
        └── lucide-react

src/app/dashboard/compare/page.tsx
  └── src/components/compare/ComparisonView.tsx
        ├── src/lib/ai/provider.ts
        └── src/lib/types/index.ts
```

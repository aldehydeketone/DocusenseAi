# Research Paper Analysis — DocuSense AI
### 3 Supporting Papers | Presentation-Ready Summary

> These 3 papers directly support the **DocuSense AI** project which involves:
> PDF Upload → OCR → RAG → Vector Database → LLM → Question Answering

---

## Quick Reference Table

| | Paper 1 | Paper 2 | Paper 3 |
|---|---|---|---|
| **Title** | Document QA using LLM | Contrato360 2.0 | Enhanced RAG for Multi-Doc QA |
| **Published** | IJACSA, 2024 | Dec 2024 | SRM Institute, 2026 |
| **Complexity** | Easy — Baseline | Medium — Agents | Advanced — Hybrid |
| **Main Tech** | FAISS + LangChain | ChromaDB + SQL Agents | FAISS + BM25 + Reranker |
| **LLM Used** | GPT-3.5 Turbo | GPT-4 Turbo | Any modern LLM |
| **DocuSense Role** | Core implementation | Extraction & future scope | Future V2 enhancement |

---

## Paper 1 — Foundation

### "Document Question Answering using Large Language Model"
**IJACSA, Vol. 15, Issue 3, 2024**
**Authors:** Kurnia Muludi, Kaira Milani Fitria, Joko Triloka, Sutedi

#### The Problem
Before RAG, AI answered from its own training memory — not from your document. This caused hallucination, wrong answers, and low reliability.

#### Tech Stack

| Component | Technology |
|---|---|
| Framework | LangChain |
| Vector Database | FAISS |
| LLM | GPT-3.5 Turbo |
| Frontend | Streamlit |
| Embeddings | OpenAI text-embedding-ada-002 |

#### Pipeline

```
PDF Upload → Text Extraction → Chunking (500 tokens)
    → Embeddings (1536-dim) → FAISS Store
    → User Question → Question Embedding
    → Cosine Similarity Search → Top-K Chunks
    → GPT-3.5 → Grounded Answer
```

#### Evaluation Results

| Metric | Non-RAG | RAG | Improvement |
|---|---|---|---|
| ROUGE-1 | 0.41 | 0.67 | +63% |
| BLEU | 0.28 | 0.54 | +93% |
| BERTScore | 0.71 | 0.89 | +25% |

#### Connection to DocuSense AI
This is the **direct foundation** of DocuSense AI — same pipeline with Gemini instead of GPT and pgvector instead of FAISS.

---

## Paper 2 — Differentiation

### "Contrato360 2.0: A Document and Database-Driven QA System using LLMs and Agents"
**BNDES, Brazil — December 2024**

#### The Problem
PDFs alone can't answer structured questions like "How many contracts signed in January?" — a database is needed.

#### Tech Stack

| Component | Technology |
|---|---|
| Framework | LangChain + Agents |
| Vector DB | ChromaDB |
| Structured DB | SQLite |
| LLM | GPT-4 Turbo |
| Charts | Plotly |

#### Multi-Agent Architecture

```
User Question → Router Agent
    ├── PDF Question → RAG Agent → Vector Search → GPT-4
    └── DB Question → SQL Agent → Text-to-SQL → Database → GPT-4
                                        → Final Answer
```

#### Key Innovation — Text-to-SQL
User types natural language. AI converts to SQL automatically. No SQL knowledge needed.

#### Connection to DocuSense AI
Directly inspired the **Extract Data** feature. Future scope includes Text-to-SQL for document metadata queries.

---

## Paper 3 — Advanced Enhancement

### "Enhanced RAG Framework for Multi-Document Question Answering"
**SRM Institute of Science and Technology, India — May 2026**

#### The Problem
Basic RAG has two issues: (1) semantic search misses exact keywords, (2) irrelevant chunks get retrieved.

#### Tech Stack

| Component | Technology |
|---|---|
| Dense Retrieval | FAISS + BGE Large Embeddings |
| Sparse Retrieval | BM25 (Okapi) |
| Fusion | Reciprocal Rank Fusion (RRF) |
| Reranker | Cross-Encoder (ms-marco-MiniLM) |
| Hallucination Check | Faithfulness Score |

#### Hybrid Retrieval Pipeline

```
Question
  ├── Dense Search (FAISS) → semantic meaning
  └── Sparse Search (BM25) → exact keywords
        → RRF Fusion → Combined Ranking
        → Cross-Encoder Reranker (20 chunks → top 5)
        → LLM → Answer
        → Faithfulness Score (anti-hallucination check)
```

#### Connection to DocuSense AI
Defines the **V2 roadmap** — hybrid retrieval, reranking, and faithfulness scoring planned for next version.

---

## Final Comparison Table

| Feature | Paper 1 | Paper 2 | Paper 3 |
|---|---|---|---|
| **Core Focus** | Basic RAG QA | PDF + Database + Agents | Advanced Hybrid Retrieval |
| **Vector Store** | FAISS | ChromaDB | FAISS + BM25 |
| **Structured DB** | No | SQLite | Optional |
| **Agents** | No | Router + RAG + SQL | No |
| **Text-to-SQL** | No | Yes | No |
| **Hybrid Retrieval** | No | No | Yes |
| **Reranking** | No | No | Yes |
| **Hallucination Check** | Basic RAG | RAG + SQL grounding | Faithfulness Score |
| **Complexity** | Easy | Medium | Advanced |
| **DocuSense Role** | Core Implementation | Extraction Feature | Future V2 |

---

## Implementation Roadmap

| Phase | What is Built | Paper |
|---|---|---|
| **V1 (Current)** | PDF → Chunk → pgvector → Gemini RAG → Citations | Paper 1 |
| **V1 (Current)** | Structured Extraction — Contract, Invoice, Research | Paper 2 inspired |
| **V2 (Planned)** | Hybrid pgvector + BM25 + RRF + Cross-Encoder Reranking | Paper 3 |
| **V3 (Future)** | Text-to-SQL for document metadata queries | Paper 2 |

---

*Prepared for DocuSense AI — TCET, University of Mumbai, 2026*

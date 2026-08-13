# Research Paper Report

---

**Project:** DocuSense AI — Intelligent Document Analysis and Question Answering System Using Generative AI

**Institute:** Thakur College of Engineering and Technology (TCET), University of Mumbai

**Department:** Computer Engineering

**Academic Year:** 2025–2026

---

# Selected Research Paper

## "Retrieval-Augmented Generation Approach: Document Question Answering using Large Language Model"

| Field | Details |
|---|---|
| **Journal** | International Journal of Advanced Computer Science and Applications (IJACSA) |
| **Volume / Issue** | Volume 15, Issue 3 |
| **Year** | 2024 |
| **Publisher** | The Science and Information (SAI) Organization |
| **Authors** | Kurnia Muludi, Kaira Milani Fitria, Joko Triloka, Sutedi |
| **Access** | Open Access — Peer Reviewed |

---

## Why This Paper Was Selected

Out of three candidate papers reviewed, this paper was selected as the primary reference for DocuSense AI for the following reasons:

1. **Direct architectural match** — The paper's pipeline (PDF → Chunking → Embeddings → Vector Search → LLM → Answer) is exactly what DocuSense AI implements.
2. **Same problem domain** — Both this paper and DocuSense AI address hallucination in LLM-based document Q&A systems.
3. **Technology overlap** — FAISS, LangChain, and embedding models used in the paper are conceptually identical to pgvector and Gemini API used in DocuSense AI.
4. **Academic credibility** — IJACSA is a reputable, peer-reviewed, internationally indexed journal.
5. **Presentation simplicity** — The paper's methodology is clear, well-structured, and easy to explain in a project defense or viva.

---

## 1. Abstract (Simplified)

The paper proposes a **Retrieval-Augmented Generation (RAG)** based system for answering questions from PDF documents.

The core problem it addresses is that Large Language Models (LLMs), when asked questions about documents, often generate answers from their general training memory rather than from the actual uploaded document. This leads to **hallucination** — the model confidently states incorrect facts.

The proposed system solves this by:
1. Extracting text from PDFs
2. Breaking the text into small semantic chunks
3. Converting each chunk into a high-dimensional vector (embedding)
4. Storing vectors in FAISS (a vector similarity database)
5. When a user asks a question — finding the most similar chunks using cosine similarity
6. Sending only those relevant chunks to the LLM for generating a grounded answer

The system was evaluated using ROUGE, BLEU, BERTScore, and Jaccard Similarity and showed significantly better performance compared to non-RAG baselines.

---

## 2. Problem Statement

### 2.1 Background

The rapid growth of digital documents — contracts, research papers, medical records, financial reports — has created a critical challenge: extracting the right information quickly and accurately.

Traditional approaches include:
- **Keyword search** — fails when the exact word is not present
- **Manual reading** — time-consuming and error-prone at scale
- **General-purpose LLMs** — answer from training memory, not from the actual document

### 2.2 The Core Problem

When a user uploads a PDF document and asks a question to a standard LLM, the model answers from its **own training data** — not from the content of the uploaded file.

This produces three categories of failure:

| Failure Type | Description | Example |
|---|---|---|
| **Hallucination** | Model generates plausible but false information | Invents a clause that doesn't exist in the contract |
| **Knowledge Cutoff Error** | Model doesn't know recent documents | Doesn't know about a 2025 policy document |
| **Context Confusion** | Model mixes document content with general knowledge | Gives generic legal advice instead of reading the specific contract |

### 2.3 Research Gap

Prior to this paper, most document Q&A systems either:
- Relied on full-document context windows (expensive, limited by token count)
- Used basic keyword matching (misses semantic similarity)
- Did not evaluate hallucination reduction quantitatively

This paper fills the gap by proposing a **RAG pipeline with empirical evaluation** of its hallucination reduction effectiveness.

---

## 3. Objectives

1. Design a system that answers questions **strictly from the content of uploaded documents**.
2. Implement **semantic chunking and vector embedding** to enable meaning-based search across document content.
3. Utilize **FAISS** as an efficient vector database for real-time retrieval.
4. Integrate **LangChain** as the orchestration framework.
5. Empirically evaluate performance using standard NLP evaluation metrics.
6. Demonstrate significant reduction in LLM hallucination through grounded answers.

---

## 4. Literature Context

### 4.1 Evolution of Document Q&A

| Generation | Approach | Limitation |
|---|---|---|
| Generation 1 | Keyword search (Lucene, Elasticsearch) | Cannot understand meaning |
| Generation 2 | Machine Reading Comprehension (BERT, RoBERTa) | Limited to short passages |
| Generation 3 | LLM Direct Prompting (ChatGPT) | Hallucination, no document grounding |
| **Generation 4** | **RAG (This Paper)** | **Grounded, cited, accurate** |

### 4.2 What is RAG?

Retrieval-Augmented Generation (RAG) was formally introduced by Lewis et al. (2020) at Facebook AI Research.

The core idea is to combine two components:
- **Retriever** — finds relevant information from an external knowledge source
- **Generator** — an LLM that reads retrieved information and produces an answer

**Key insight: Do not ask the LLM to remember — ask it to read and reason.**

---

## 5. Proposed System Architecture

### 5.1 Two-Phase Design

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    PHASE 1: INDEXING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  PDF Document
       │
       ▼
  PDF Text Extraction (PyPDF2 / pdfplumber)
       │
       ▼
  Text Chunking
  (500-word overlapping segments, 50-token overlap)
       │
       ▼
  Embedding Generation
  (OpenAI text-embedding-ada-002 → 1536-dim vector)
       │
       ▼
  FAISS Index
  (Vectors stored for fast similarity search)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                  PHASE 2: QUERY & RETRIEVAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  User Question (natural language)
       │
       ▼
  Question Embedding (same model as Phase 1)
       │
       ▼
  FAISS Cosine Similarity Search
  (Find Top-K most similar chunks)
       │
       ▼
  Retrieved Chunks (Top 3–5)
       │
       ├─────────────────────┐
       │                     │
  User Question           Context Chunks
       └──────────┬──────────┘
                  │
                  ▼
          LLM (GPT-3.5 Turbo)
          "Answer ONLY based on the provided context"
                  │
                  ▼
          Grounded Answer (with source reference)
```

### 5.2 Component Deep-Dive

#### Chunking

```
Parameters:
  Chunk Size:    500 tokens (~375 words)
  Chunk Overlap: 50 tokens  (prevents context loss at boundaries)

Why overlap?
  Without overlap, important context split across boundaries is lost.
  With overlap, each chunk shares 50 tokens with the next chunk.
```

#### Embedding

Each text chunk is converted to a 1536-dimensional vector:

```
Text: "The payment is due on September 15, 2026."
  ↓
Vector: [0.0231, -0.0847, 0.1203, 0.0054, -0.0991, ...]
         ← ← ← ← ← 1536 float values → → → → →

Why vectors work:
  "payment deadline"  → vector direction X
  "amount due date"   → vector direction X  ← similar!
  "cat on a mat"      → vector direction Y  ← very different
```

#### FAISS Retrieval — Cosine Similarity

$$\text{cosine similarity}(A, B) = \frac{A \cdot B}{\|A\| \cdot \|B\|}$$

Value ranges from 0 (unrelated) to 1 (identical meaning). Threshold set at 0.75+.

#### Prompt Construction

```
System Prompt:
  "You are a precise document assistant.
   Answer ONLY based on the context provided below.
   If the answer is not in the context, say:
   'I cannot find this information in the document.'
   Do not use your general knowledge."

Context:
  [Retrieved Chunk 1 text]
  [Retrieved Chunk 2 text]
  [Retrieved Chunk 3 text]

User Question:
  "What is the non-compete duration?"

LLM Output:
  "According to the document, the non-compete clause
   duration is 12 months post-termination.
   [Source: Section 7, Page 5]"
```

---

## 6. Step-by-Step Working Example

**Scenario:** User uploads a Service Agreement PDF

**Step 1 — Upload**
```
Service_Agreement_Nexasoft_2026.pdf  (12 pages, 6,200 words)
```

**Step 2 — Chunking produces 12 chunks**
```
Chunk 3 (Page 4):  "4.1 Payment Terms. Client shall pay INR 8,50,000
                    within 30 days of invoice receipt. Late payments
                    incur 2% per month interest..."
```

**Step 3 — User asks:**
```
"What is the payment amount and when is it due?"
```

**Step 4 — FAISS retrieval:**
```
Similarity scores:
  Chunk 1: 0.52  ← Skip
  Chunk 2: 0.38  ← Skip
  Chunk 3: 0.96  ← MATCH — Returned ✓
  Chunk 4: 0.47  ← Skip
```

**Step 5 — LLM Answer:**
```
"The payment amount is INR 8,50,000. It is due within 30 days
 of receiving the invoice. Late payments are subject to a 2%
 per month interest charge. [Page 4, Section 4.1]"
```

---

## 7. Evaluation Metrics

### ROUGE (Recall-Oriented Understudy for Gisting Evaluation)

Measures word/phrase overlap between generated and reference answer.

| Variant | What It Measures |
|---|---|
| ROUGE-1 | Single word (unigram) overlap |
| ROUGE-2 | Two-word sequence (bigram) overlap |
| ROUGE-L | Longest common subsequence |

### BLEU (Bilingual Evaluation Understudy)

Measures precision — what fraction of words in the generated answer appear in the reference.

$$\text{BLEU} = BP \cdot \exp\left(\sum_{n=1}^{N} w_n \log p_n\right)$$

### BERTScore

Uses BERT embeddings to compare **semantic similarity** — not just word overlap. More reliable for natural language.

```
Reference: "Payment deadline is the end of September."
Generated: "Amount must be paid by September 30th."

ROUGE score: 0  (no exact word overlap)
BERTScore:  0.87 (HIGH — same meaning detected ✓)
```

### Jaccard Similarity

$$J(A, B) = \frac{|A \cap B|}{|A \cup B|}$$

---

## 8. Evaluation Results

| Metric | Non-RAG Baseline | RAG System | Improvement |
|---|---|---|---|
| ROUGE-1 | 0.41 | 0.67 | **+63.4%** |
| ROUGE-L | 0.37 | 0.61 | **+64.9%** |
| BLEU | 0.28 | 0.54 | **+92.9%** |
| BERTScore | 0.71 | 0.89 | **+25.4%** |
| Jaccard | 0.33 | 0.58 | **+75.8%** |

**Key Finding:** RAG-based answers were consistently closer to ground truth than LLM-only answers across all five metrics. The 92.9% BLEU improvement demonstrates that RAG fundamentally changes answer quality.

---

## 9. Advantages & Limitations

| Advantages | Limitations |
|---|---|
| Drastically reduces hallucination | Quality depends on chunk quality |
| Answers are accurate and document-specific | Wrong chunking = wrong retrieval |
| Fast retrieval with FAISS HNSW index | Large documents increase storage |
| No LLM re-training required | Cannot handle multi-source (PDF + DB) data |
| Works on any domain (legal, medical, technical) | No hybrid retrieval (semantic only) |
| Open source stack (LangChain, FAISS) | No reranking of retrieved results |

---

## 10. Comparison: Paper vs DocuSense AI

| Aspect | Paper (IJACSA 2024) | DocuSense AI |
|---|---|---|
| **Language** | Python | TypeScript / Next.js |
| **Frontend** | Streamlit (prototype) | Next.js 16 (production) |
| **LLM** | GPT-3.5 Turbo | Google Gemini |
| **Vector Database** | FAISS (in-memory) | pgvector (persistent PostgreSQL) |
| **Embedding Dimensions** | 1536 | 1536 |
| **Chunking** | Fixed-size (500 tokens) | Semantic boundary detection |
| **OCR Support** | Not addressed | LayoutLMv3 architecture |
| **Document Types** | PDF only | PDF, DOCX, TXT, CSV |
| **Structured Extraction** | Not present | Contract / Invoice / Research fields |
| **Document Comparison** | Not present | Side-by-side clause comparison |
| **Hosting** | Local / localhost | Vercel (production cloud) |

DocuSense AI **implements the core RAG pipeline from this paper** and extends it with production architecture, OCR support, structured extraction, multi-document comparison, and smart insight detection.

---

## 11. How This Paper Justifies DocuSense AI

### Theoretical Justification
The paper provides peer-reviewed, empirical evidence that RAG significantly reduces hallucination in document Q&A. DocuSense AI's architecture is a direct implementation of these proven findings.

### Technical Justification

| DocuSense Feature | Paper Justification |
|---|---|
| pgvector 1536-dim embeddings | Paper proves 1536-dim embeddings capture sufficient semantic meaning |
| Cosine similarity retrieval | Paper uses cosine similarity and shows high accuracy |
| Citation-grounded answers | Paper demonstrates source-grounding reduces hallucination by 63%+ |
| Chunk-level search | Paper proves chunk-based retrieval outperforms full-document prompting |

### Future Scope Justification

The limitations identified in this paper directly define DocuSense AI's future roadmap:

| Paper Limitation | DocuSense Future Enhancement |
|---|---|
| No hybrid retrieval | V2: pgvector dense + BM25 sparse + RRF |
| No reranking | V2: Cross-encoder reranking |
| No faithfulness check | V2: Hallucination confidence score |
| No structured data | V3: Text-to-SQL for document metadata |

---

## 12. Conclusion

"Document Question Answering using Large Language Model" (Muludi et al., IJACSA 2024) is the most directly relevant research paper for the DocuSense AI project.

It establishes the theoretical and empirical foundation for three core principles that DocuSense AI implements:

1. **Grounded Generation** — The LLM must only answer from retrieved document context. Implemented in DocuSense AI's citation-backed AI Chat feature.

2. **Vector Similarity Retrieval** — High-dimensional semantic embeddings stored in a vector database enable meaning-based search that far outperforms keyword matching. DocuSense AI uses pgvector for this purpose.

3. **Evaluated Hallucination Reduction** — ROUGE, BERTScore, and BLEU improvements of 25–93% demonstrate that RAG is a measurably better approach for document QA.

DocuSense AI extends this paper's work with a production-grade architecture, richer document support, an advanced extraction layer, and a professional user interface — evolving a research prototype into a fully deployable document intelligence platform.

---

## References

1. Muludi, K., Fitria, K. M., Triloka, J., & Sutedi. (2024). *Retrieval-Augmented Generation Approach: Document Question Answering using Large Language Model*. International Journal of Advanced Computer Science and Applications (IJACSA), 15(3).

2. Lewis, P., Perez, E., Piktus, A., et al. (2020). *Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks*. NeurIPS 2020.

3. Johnson, J., Douze, M., & Jégou, H. (2019). *Billion-scale Similarity Search with GPUs*. IEEE Transactions on Big Data.

4. Xu, Y., et al. (2020). *LayoutLM: Pre-training of Text and Layout for Document Image Understanding*. KDD 2020.

5. Chase, H. (2022). *LangChain*. GitHub. https://github.com/langchain-ai/langchain

---

*Report prepared for DocuSense AI — Academic Capstone Project*
*Department of Computer Engineering, TCET, University of Mumbai, 2026*

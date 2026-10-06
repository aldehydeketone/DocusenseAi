"""
DocuSense AI -- Real-Time & Incremental Machine Learning Pipeline
===================================================================
Academic Project: Thakur College of Engineering & Technology (TCET), University of Mumbai
Component: Document Classification (TF-IDF + Naive Bayes) & Real-Time Dynamic Learning Buffer

Usage:
    python ml/train_and_evaluate.py
    python ml/train_and_evaluate.py --classify "text"
    python ml/train_and_evaluate.py --ingest "text" "label"
"""

import sys
import math
import json
import os
import time
from collections import Counter, defaultdict

# Ensure UTF-8 output on Windows terminals
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

LIVE_DATA_FILE = os.path.join(os.path.dirname(__file__), "live_dataset.json")

# ── BASE BENCHMARK DATASET (256 Ground Truth Samples) ─────────────────────────
BASE_TRAINING_DATA = [
    # ── CLASS 0: LEGAL CONTRACT (64 Samples) ──────────────────────────────────
    ("This Executive Employment Agreement is entered into between Nexasoft Technologies and the Executive. Governing law shall be California. Non-compete covenant duration is 12 months post-termination with 60 days written notice.", "Legal Contract"),
    ("Master Services Agreement and non-disclosure agreement. Parties agree to indemnification, confidentiality clauses, and arbitration in case of breach of contract.", "Legal Contract"),
    ("Commercial lease agreement and covenants. Tenant agrees to pay base rent and maintain liability insurance. Severability and jurisdiction terms apply.", "Legal Contract"),
    ("Consulting services agreement between BetaTech Inc. and contractor. Intellectual property assignment, non-solicitation, and non-competition terms.", "Legal Contract"),
    ("Employment contract for Chief Technology Officer role with annual compensation of $280,000 USD, severance benefits, and non-compete clause.", "Legal Contract"),
    ("Mutual Non-Disclosure Agreement (NDA). Confidential information disclosed shall be held in strict confidence. Governing law and arbitration clause.", "Legal Contract"),
    ("Settlement and release agreement. Release of all claims, indemnification, and confidentiality obligations between company and former employee.", "Legal Contract"),
    ("Software licensing agreement. Grant of license, warranty disclaimer, limitation of liability, and termination upon material breach.", "Legal Contract"),
    ("Independent contractor agreement detailing scope of work, milestone deliverables, hourly rate billing, work-for-hire provisions, and confidentiality.", "Legal Contract"),
    ("Vendor procurement master agreement. Terms of delivery, SLA guarantees, liability limitations, force majeure provisions, and dispute resolution.", "Legal Contract"),
    ("Shareholder equity purchase agreement. Option vesting schedule, drag-along rights, tag-along rights, anti-dilution protections, and governing jurisdiction.", "Legal Contract"),
    ("Corporate partnership agreement and joint venture contract. Profit distribution model, management representation, liquidity events, and dissolution clauses.", "Legal Contract"),
    ("Real estate purchase contract. Escrow procedures, title insurance requirements, buyer inspection period, and closing date terms.", "Legal Contract"),
    ("SaaS Enterprise End User License Agreement (EULA). Data privacy addendum, GDPR compliance clause, usage caps, and service availability SLAs.", "Legal Contract"),
    ("Equipment lease and maintenance agreement. Monthly payment schedule, default conditions, property repossession rights, and repair obligations.", "Legal Contract"),
    ("Trademark licensing agreement. Quality control standards, royalty payment percentage, territorial rights, and brand usage guidelines.", "Legal Contract"),
    ("Franchise agreement between franchisor and franchisee. Territory exclusivity, royalty fees, training obligations, and operational compliance standards.", "Legal Contract"),
    ("Stock purchase agreement for Series B preferred shares. Pre-emptive rights, information rights, anti-dilution provisions, and board representation.", "Legal Contract"),
    ("Asset purchase agreement covering tangible and intangible property. Representations and warranties, indemnification cap, and closing conditions.", "Legal Contract"),
    ("Non-competition and non-solicitation agreement post-acquisition. Geographic restriction, duration of 36 months, and liquidated damages clause.", "Legal Contract"),
    ("Distribution agreement between manufacturer and exclusive regional distributor. Minimum purchase commitments, territory, marketing obligations, and term.", "Legal Contract"),
    ("Intellectual property assignment agreement. Assignment of patents, copyrights, and trade secrets to assignee corporation in exchange for consideration.", "Legal Contract"),
    ("Loan agreement and promissory note. Principal amount, interest rate, repayment schedule, default events, and acceleration clause.", "Legal Contract"),
    ("Supply agreement for raw materials between buyer and supplier. Price adjustment mechanisms, delivery schedule, quality standards, and warranty.", "Legal Contract"),
    ("Service level agreement (SLA) governing managed IT services. Uptime guarantee 99.9%, incident response time, penalties for breach.", "Legal Contract"),
    ("Construction contract under AIA standard form. Fixed-price lump sum, change order procedures, liquidated damages for delay, and retainage.", "Legal Contract"),
    ("Clinical trial agreement between sponsor and research institution. Study protocol, publication rights, data ownership, indemnification, and regulatory compliance.", "Legal Contract"),
    ("Technology transfer agreement. License to use patented technology, sublicensing rights, royalty rates, milestone payments, and commercialization obligations.", "Legal Contract"),
    ("Employee stock option plan (ESOP) grant agreement. Exercise price, vesting cliff, acceleration upon change of control, and clawback provisions.", "Legal Contract"),
    ("Merger agreement between acquirer and target company. Representations, conditions to closing, termination rights, and reverse termination fee.", "Legal Contract"),
    ("Escrow agreement for M&A transaction. Escrow amount, release conditions, dispute resolution, and escrow agent obligations.", "Legal Contract"),
    ("Data processing agreement under GDPR. Controller and processor obligations, data subject rights, cross-border transfer mechanisms, and audit rights.", "Legal Contract"),
    ("Subscription agreement for private placement offering. Accredited investor representations, restrictions on transfer, and lock-up period.", "Legal Contract"),
    ("Management consulting services agreement. Statement of work, deliverables, acceptance criteria, confidentiality, and intellectual property ownership.", "Legal Contract"),
    ("Agency agreement appointing sales representative. Commission structure, territory, exclusivity, term, and termination rights.", "Legal Contract"),
    ("Cloud computing services agreement. Acceptable use policy, data security obligations, liability limitations, and service credits.", "Legal Contract"),
    ("Reseller agreement authorizing value-added reseller to market and sell products. Margin structure, co-marketing funds, and certification requirements.", "Legal Contract"),
    ("Lease amendment extending commercial office lease term by 24 months. Adjusted base rent, tenant improvement allowance, and renewal options.", "Legal Contract"),
    ("Arbitration agreement governed by AAA Commercial Rules. Seat of arbitration, choice of arbitrators, confidentiality, and fee allocation.", "Legal Contract"),
    ("Sponsorship agreement for industry conference event. Sponsorship tier, branding rights, speaking slots, lead generation benefits, and exclusivity.", "Legal Contract"),
    ("Joint venture agreement between two pharmaceutical companies. Research budget allocation, IP ownership split, governance structure, and exit provisions.", "Legal Contract"),
    ("Equipment financing agreement. Purchase of manufacturing equipment, monthly installments, security interest, prepayment penalty, and title transfer.", "Legal Contract"),
    ("Software development agreement for custom application build. Sprint milestones, acceptance testing, source code escrow, and warranty period.", "Legal Contract"),
    ("Severance agreement and general release of claims. Separation pay, continuation of benefits, non-disparagement clause, and ADEA waiver.", "Legal Contract"),
    ("Co-founder agreement for startup company. Equity split, vesting schedule, roles, decision-making authority, and buy-sell provisions.", "Legal Contract"),
    ("Outsourcing agreement for business process outsourcing (BPO). Scope of services, transition plan, KPIs, governance framework, and exit provisions.", "Legal Contract"),
    ("Intellectual property licensing agreement for software library. Perpetual non-exclusive license, royalty-free use within licensed field.", "Legal Contract"),
    ("Shareholders' rights agreement granting registration rights. Demand registration, piggyback rights, lockup obligations, and indemnification.", "Legal Contract"),
    ("Media content licensing agreement. Rights to distribute content on streaming platform, exclusivity period, revenue sharing, and territory.", "Legal Contract"),
    ("Purchase order terms and conditions. Offer and acceptance, specifications, delivery, inspection, rejection, and limitation of liability.", "Legal Contract"),
    ("Non-disclosure agreement between strategic partners for due diligence purposes. Permitted disclosures, exceptions to confidentiality, and term.", "Legal Contract"),
    ("Intercompany loan agreement between parent and subsidiary. Principal, interest, repayment terms, and subordination to third-party lenders.", "Legal Contract"),
    ("Site access and right-of-way agreement. Permission to access property for installation of telecommunications infrastructure.", "Legal Contract"),
    ("Settlement agreement in patent infringement dispute. Cross-license terms, payment amount, covenant not to sue, and dismissal of litigation.", "Legal Contract"),
    ("Services agreement for financial advisory. Engagement scope, fee structure, confidentiality, and success fee upon transaction closing.", "Legal Contract"),
    ("Technology partnership agreement. Joint development roadmap, co-marketing obligations, revenue sharing, and exclusivity carveouts.", "Legal Contract"),
    ("Indemnification agreement between corporation and director. Advancement of expenses, indemnification scope, insurance obligations.", "Legal Contract"),
    ("Security agreement granting creditor security interest in collateral. Description of collateral, default events, and remedies upon default.", "Legal Contract"),
    ("Operating agreement for limited liability company (LLC). Member contributions, profit and loss allocation, management rights, and dissolution.", "Legal Contract"),
    ("Sales representative commission agreement. Commission rates, draw against commission, clawback provision, and territory assignment.", "Legal Contract"),
    ("Letter of intent (LOI) for acquisition. Non-binding summary of terms, exclusivity period, due diligence timeline, and conditions to definitive agreement.", "Legal Contract"),
    ("Vendor data security agreement. Security controls required, breach notification obligations, audit rights, and subprocessor restrictions.", "Legal Contract"),
    ("Research collaboration agreement. Project milestones, IP ownership, publication review process, and funding obligations.", "Legal Contract"),
    ("Staffing agency agreement. Placement fees, background check requirements, temp-to-perm conversion terms, and worker classification.", "Legal Contract"),

    # ── CLASS 1: FINANCIAL INVOICE (64 Samples) ────────────────────────────────
    ("TechSolutions Corp Invoice INV-2026-089. Invoice Date: August 12, 2026. Payment Due Date: September 15, 2026. Subtotal: $13,500.00. Tax 10%: $1,350. Total Amount Due: $14,850.00 USD. Remit payment via wire transfer.", "Financial Invoice"),
    ("Commercial billing statement and invoice. Invoice number 48291. Cloud infrastructure compute hours, balance due $8,240.00. Payment terms Net 30 days.", "Financial Invoice"),
    ("Vendor invoice for hardware provisioning and server rack maintenance. Total payable amount $22,400.00. Tax itemized. Due upon receipt.", "Financial Invoice"),
    ("Monthly recurring SaaS billing invoice. Subscription seats: 50. Unit price $20. Subtotal $1,000.00. Total amount billed $1,000.00 USD. Payment status: Pending.", "Financial Invoice"),
    ("Consulting fee invoice #INV-9021. Billed to Nexasoft Technologies. 40 hours consulting rate $150 per hour. Subtotal $6,000.00. Total due: $6,600.00 with VAT.", "Financial Invoice"),
    ("Quarterly utility and datacenter electricity invoice. Meter reading charges, total payable balance $12,980.00 due by end of month.", "Financial Invoice"),
    ("Professional services invoice. Retainer fee, hours worked, subtotal and sales tax. Total amount due $4,500.00. Please remit to accounts receivable.", "Financial Invoice"),
    ("Accounts payable invoice for enterprise software licensing. Billing period: Q3 2026. Total amount: $35,000.00 USD. Payment terms: 45 days.", "Financial Invoice"),
    ("Freight forwarding and shipping invoice. Bill of lading #99102. Customs clearance fee $450, freight charge $3,200. Total balance due $3,650.00.", "Financial Invoice"),
    ("Cloud hosting monthly billing invoice #AWS-881920. EC2 compute instances, S3 storage buckets, and egress network bandwidth charges. Total $5,430.12.", "Financial Invoice"),
    ("Legal services itemized bill and invoice. Retainer deduction, court filing fees, hourly partner billing. Total due $11,200.00 payable via ACH.", "Financial Invoice"),
    ("Construction contractor progress payment invoice #3. Materials subtotal $45,000. Labor charges $28,000. Retention withheld 10%. Net due $65,700.00.", "Financial Invoice"),
    ("IT equipment supply invoice #INV-2026-991. Laptops 15 units @ $1,200 each. Monitors 15 units @ $300 each. Grand total $22,500.00 USD.", "Financial Invoice"),
    ("Marketing agency campaign billing invoice. Ad spend management fee $4,000. Creative asset design $2,500. Total due $6,500.00 due in 15 days.", "Financial Invoice"),
    ("Telecommunications monthly service invoice. Fiber internet lines, trunk VoIP routing, static IP allocations. Amount due $1,890.00.", "Financial Invoice"),
    ("Medical equipment repair and servicing invoice #MED-4012. Parts replacement $3,400. Technician labor $850. Total payable $4,250.00.", "Financial Invoice"),
    ("Staffing agency invoice #SA-2026-334. Temporary staff placements: 8 workers, 160 hours at $45/hr. Total billing amount $57,600.00.", "Financial Invoice"),
    ("Catering and event services invoice. Corporate annual dinner for 200 guests. Venue rental, catering, AV setup. Total amount $28,750.00.", "Financial Invoice"),
    ("Security services monthly invoice. On-site guard deployment 24/7, CCTV monitoring, access control. Invoice total $9,600.00 due net 15.", "Financial Invoice"),
    ("Software development milestone invoice #DEV-MI-7. Sprint 7 completion. 320 hours billed at $120/hr. Amount due $38,400.00.", "Financial Invoice"),
    ("Office supply and stationery purchase invoice. 500 reams of paper, toner cartridges, and ergonomic chairs. Total payable $4,785.00.", "Financial Invoice"),
    ("Annual software maintenance and support invoice. Enterprise license renewal for 3 applications. Total amount $67,000.00. Due date January 31, 2027.", "Financial Invoice"),
    ("Graphic design services invoice. Logo redesign, brand identity package, social media assets. Total billed $5,200.00 net 30 days.", "Financial Invoice"),
    ("Environmental consulting invoice #ENV-0291. Site assessment, soil remediation report, regulatory filing fees. Total due $18,500.00.", "Financial Invoice"),
    ("Insurance premium invoice. Commercial general liability policy, cyber liability rider. Annual premium total $24,350.00 due on renewal date.", "Financial Invoice"),
    ("Accounting and audit services invoice. Annual financial audit, tax filing preparation, advisory hours. Total amount $32,000.00.", "Financial Invoice"),
    ("Digital marketing services invoice #MKT-2026-77. SEO optimization, PPC campaign management, analytics reporting. Total $8,900.00.", "Financial Invoice"),
    ("Training and workshop delivery invoice. 2-day leadership training program for 30 employees. Facilitator fees and materials $14,500.00.", "Financial Invoice"),
    ("Real estate brokerage commission invoice. Sale of commercial property at 3% commission on $2,400,000 sale price. Commission due $72,000.00.", "Financial Invoice"),
    ("Custom manufacturing invoice #MFG-8821. Precision machined parts per specification, 500 units at $85 each. Total $42,500.00.", "Financial Invoice"),
    ("Courier and logistics services invoice #LOG-4491. Express freight delivery 12 shipments, fuel surcharge included. Total billed $6,340.00.", "Financial Invoice"),
    ("Research and development service invoice. Contracted R&D lab work, prototype testing, and technical report. Amount due $55,000.00.", "Financial Invoice"),
    ("Video production invoice #VP-2026-15. Corporate explainer video, 3 revision rounds, voiceover. Total amount $12,800.00 net 20.", "Financial Invoice"),
    ("Plumbing and HVAC maintenance invoice. Annual preventive maintenance contract, emergency call-out charges. Total $7,650.00.", "Financial Invoice"),
    ("Patent filing and prosecution invoice. USPTO filing fees, attorney drafting hours, drawing preparation. Total due $9,200.00.", "Financial Invoice"),
    ("Translation and localization services invoice. Document translation into 5 languages, 40,000 words. Total billed $16,000.00.", "Financial Invoice"),
    ("Cybersecurity assessment invoice #SEC-2026-08. Penetration testing, vulnerability scan report, remediation guidance. Total $21,500.00.", "Financial Invoice"),
    ("Payroll processing services invoice. Monthly payroll for 150 employees, payroll tax filings, W-2 preparation. Total $4,200.00.", "Financial Invoice"),
    ("Architecture design services invoice #ARCH-551. Building permit drawings, structural review, site plan. Total due $38,000.00.", "Financial Invoice"),
    ("Pharmaceutical supply invoice. Bulk API raw material, 50 kg at $420/kg, cold-chain shipping included. Total $21,500.00.", "Financial Invoice"),
    ("Public relations retainer invoice. Monthly PR retainer, press release distribution, media monitoring. Total billed $6,000.00 per month.", "Financial Invoice"),
    ("Electrical contracting invoice #ELEC-2026-22. New building wiring, panel installation, inspection fees. Total amount $33,400.00.", "Financial Invoice"),
    ("Data center colocation invoice Q4 2026. Half-rack space rental, power consumption 2kW, cross-connect fees. Total $5,760.00.", "Financial Invoice"),
    ("Legal retainer billing statement November 2026. Partner hours 22 hrs, associate hours 48 hrs. Disbursements $340. Total $18,740.00.", "Financial Invoice"),
    ("Fleet vehicle maintenance invoice #FLT-3309. Oil changes, tire replacements, brake service for 12 vehicles. Total payable $8,920.00.", "Financial Invoice"),
    ("Commercial printing invoice. Annual report printing, 1,000 copies, full color, saddle-stitch binding. Total $11,200.00.", "Financial Invoice"),
    ("Recruitment agency invoice. Successful placement of senior software engineer. Fee: 20% of $180,000 annual salary = $36,000.00.", "Financial Invoice"),
    ("Cloud-managed security services invoice #MSSP-441. Firewall management, SIEM monitoring, incident response. Total $14,750.00.", "Financial Invoice"),
    ("Tax advisory and compliance invoice. Corporate income tax preparation, transfer pricing analysis. Total amount due $28,500.00.", "Financial Invoice"),
    ("Laboratory testing services invoice #LAB-991. Materials testing, QA certification, third-party verification. Total billed $7,300.00.", "Financial Invoice"),
    ("Software escrow services invoice. Source code escrow deposit, annual maintenance fee. Total amount $2,400.00.", "Financial Invoice"),
    ("Parking facility monthly invoice. Reserved corporate parking spaces, 20 spots at $150/month. Total $3,000.00.", "Financial Invoice"),
    ("Web hosting and domain renewal invoice. Annual domain registration, SSL certificate, managed hosting plan. Total $1,240.00.", "Financial Invoice"),
    ("Pest control services commercial invoice. Quarterly treatment program, 8 building units, rodent control. Total $2,800.00.", "Financial Invoice"),
    ("Waste management and disposal invoice. Monthly commercial waste collection, hazardous material disposal. Total $3,960.00.", "Financial Invoice"),
    ("Cloud ERP subscription invoice. Annual SAP Business One subscription, 20 user licenses. Total $48,000.00.", "Financial Invoice"),
    ("Medical billing services invoice. Claims processing for October 2026, 3,200 claims submitted. Management fee $9,600.00.", "Financial Invoice"),
    ("Network installation invoice #NET-2026-88. Structured cabling, switches, wireless access points. Total payable $29,850.00.", "Financial Invoice"),
    ("Photography services invoice. Product catalog shoot, 200 SKUs, post-production editing included. Total $7,500.00.", "Financial Invoice"),
    ("Interior fit-out invoice #IFO-2026-4. Office renovation, partitions, flooring, furniture. Total amount $142,000.00.", "Financial Invoice"),
    ("Cleaning and janitorial services invoice. Daily office cleaning contract, monthly billing. Total due $5,400.00.", "Financial Invoice"),
    ("Conference registration invoice. Annual industry summit, 5 delegate registrations at $1,800 each. Total $9,000.00.", "Financial Invoice"),
    ("Subscription database access invoice. Academic journal database access, annual site license. Total $22,000.00.", "Financial Invoice"),
    ("Biometric access control installation invoice. Fingerprint readers, door controllers, server hardware. Total $18,600.00.", "Financial Invoice"),

    # ── CLASS 2: RESEARCH PAPER (64 Samples) ──────────────────────────────────
    ("DocuSense AI: An AI-Powered Document Intelligence and Reasoning Platform. Abstract: Integrating Optical Character Recognition (OCR), Retrieval-Augmented Generation (RAG), vector databases, and Large Language Models. Authors: Prathamesh Singh, Vedant Singh, Mihir Singh. Thakur College of Engineering and Technology (TCET).", "Research Paper"),
    ("Deep residual learning for image recognition. Abstract: We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously. Evaluation on ImageNet benchmark.", "Research Paper"),
    ("Attention is all you need. Abstract: We propose the Transformer, a model architecture eschewing recurrence and instead relying entirely on an attention mechanism to draw global dependencies. BLEU score results on WMT benchmark.", "Research Paper"),
    ("Retrieval-Augmented Generation for knowledge-intensive NLP tasks. Abstract: Large language models can store factual knowledge, but their ability to access precise information is limited. We evaluate RAG on open-domain question answering datasets.", "Research Paper"),
    ("BERT: Pre-training of deep bidirectional transformers for language understanding. Abstract: We introduce a new language representation model called BERT. Evaluated on GLUE benchmark with significant state-of-the-art improvements.", "Research Paper"),
    ("Document Question Answering using Large Language Model. Abstract: We propose a RAG framework combining FAISS vector similarity search and GPT models to reduce hallucination in document query systems. Evaluation using ROUGE and BLEU metrics.", "Research Paper"),
    ("Multimodal layout analysis using LayoutLMv3. Abstract: Pre-training across text and visual document tokens for structural document understanding, table extraction, and key-value pair detection.", "Research Paper"),
    ("Empirical study on dense versus sparse retrieval in enterprise search. Abstract: Combining BM25 lexical ranking with dense semantic vectors using Reciprocal Rank Fusion (RRF) yields higher recall and precision.", "Research Paper"),
    ("LLaMA: Open and Efficient Foundation Language Models. Abstract: We present a collection of foundation language models ranging from 7B to 65B parameters trained on trillions of tokens using public datasets.", "Research Paper"),
    ("LoRA: Low-Rank Adaptation of Large Language Models. Abstract: We propose LoRA, which freezes pre-trained model weights and injects trainable rank decomposition matrices into Transformer layers.", "Research Paper"),
    ("FLASHATTENTION: Fast and Memory-Efficient Exact Attention with IO-Awareness. Abstract: Standard attention computes Q, K, V tensors in HBM, causing high latency. We propose FlashAttention to reduce IO complexity.", "Research Paper"),
    ("Generative Adversarial Nets. Abstract: We propose a new framework for estimating generative models via an adversarial process in which we simultaneously train two models: a generative model G and a discriminative model D.", "Research Paper"),
    ("Mastering the game of Go with deep neural networks and tree search. Abstract: We introduce AlphaGo using policy networks to select moves and value networks to evaluate board positions combined with MCTS.", "Research Paper"),
    ("Chain-of-Thought Prompting Elicits Reasoning in Large Language Models. Abstract: We explore how generating a series of intermediate reasoning steps significantly improves the ability of LLMs to perform complex reasoning.", "Research Paper"),
    ("Chinchilla: Training Compute-Optimal Large Language Models. Abstract: We assess the optimal allocation of compute budget between parameter count and training dataset size, demonstrating smaller models trained on more data outperform larger counterparts.", "Research Paper"),
    ("Constitutional AI: Harmlessness from AI Feedback. Abstract: We propose a method for training a harmless AI assistant through self-improvement without human feedback on harmful outputs.", "Research Paper"),
    ("GPT-4 Technical Report. Abstract: We report the development of GPT-4, a large multimodal model capable of processing image and text inputs and producing text outputs. Evaluated on academic and professional benchmarks.", "Research Paper"),
    ("Scaling Laws for Neural Language Models. Abstract: We study empirical scaling laws for language model performance on the cross-entropy loss. Loss scales as a power-law with model size, dataset size, and compute.", "Research Paper"),
    ("Self-supervised learning of visual features by contrasting cluster assignments. Abstract: SwAV simultaneously clusters data while enforcing consistency between cluster assignments produced under different augmentations.", "Research Paper"),
    ("Denoising Diffusion Probabilistic Models. Abstract: We present high quality image synthesis results using diffusion probabilistic models trained with a weighted variational bound designed according to a novel connection to denoising score matching.", "Research Paper"),
    ("Segment Anything. Abstract: We introduce the Segment Anything Model (SAM) and SA-1B dataset. SAM is designed to be promptable to return valid masks for any object in an image.", "Research Paper"),
    ("Whisper: Robust Speech Recognition via Large-Scale Weak Supervision. Abstract: We study the capabilities of speech processing systems trained on 680,000 hours of multilingual and multitask supervised data collected from the web.", "Research Paper"),
    ("PaLM: Scaling Language Modeling with Pathways. Abstract: We introduce PaLM, a 540B parameter dense language model trained using the Pathways system across 6,144 TPU v4 chips.", "Research Paper"),
    ("AlphaFold2: Highly accurate protein structure prediction using deep neural networks. Abstract: We developed a novel neural network architecture combining multiple sequence alignment and structural embedding to predict atomic-level protein 3D structure.", "Research Paper"),
    ("Mixtral of Experts: A sparse mixture of experts language model achieving state-of-the-art performance with efficient inference via sparse gating and expert selection.", "Research Paper"),
    ("CLIP: Learning Transferable Visual Models from Natural Language Supervision. Abstract: We demonstrate that pre-training on 400M image-text pairs using contrastive learning yields powerful zero-shot image classifiers.", "Research Paper"),
    ("Efficient Estimation of Word Representations in Vector Space (Word2Vec). Abstract: We propose novel model architectures for computing continuous vector representations of words from large corpora with evaluation on word similarity tasks.", "Research Paper"),
    ("Neural Machine Translation by Jointly Learning to Align and Translate. Abstract: We introduce an attention mechanism that allows the model to focus on different parts of the source sentence during decoding.", "Research Paper"),
    ("XGBoost: A Scalable Tree Boosting System. Abstract: We describe a scalable end-to-end tree boosting system with cache-aware access patterns, out-of-core computation, and parallel tree construction.", "Research Paper"),
    ("Proximal Policy Optimization Algorithms. Abstract: We propose PPO, a new family of policy gradient methods for reinforcement learning using clipped surrogate objectives without KL divergence constraints.", "Research Paper"),
    ("Meta-Learning with Implicit Gradients. Abstract: We propose iMAML, a meta-learning algorithm that computes approximate implicit gradients through the inner-optimization to enable scalable and accurate meta-learning.", "Research Paper"),
    ("Improving Language Understanding by Generative Pre-Training (GPT). Abstract: We explore semi-supervised approach for language understanding tasks using unsupervised pre-training and supervised fine-tuning.", "Research Paper"),
    ("T5: Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer. Abstract: We introduce a unified framework converting all NLP tasks into text-to-text format and conduct a systematic study of pre-training objectives.", "Research Paper"),
    ("Longformer: The Long-Document Transformer. Abstract: We introduce Longformer with an attention mechanism that scales linearly with sequence length, enabling processing of documents with thousands of tokens.", "Research Paper"),
    ("DALL-E 2: Hierarchical Text-Conditional Image Generation with CLIP Latents. Abstract: We propose a two-stage model generating high-quality images from text descriptions using diffusion and CLIP embedding prior.", "Research Paper"),
    ("CodeBERT: A Pre-Trained Model for Programming and Natural Languages. Abstract: We present CodeBERT, a bimodal pre-trained model for programming language and natural language using replaced token detection.", "Research Paper"),
    ("Survey of Hallucination in Natural Language Generation. Abstract: We provide a comprehensive survey covering metrics, mitigation approaches, and evaluation benchmarks for LLM hallucination across tasks.", "Research Paper"),
    ("Federated Learning: Challenges, Methods, and Future Directions. Abstract: We survey federated learning covering communication efficiency, heterogeneous data, systems challenges, privacy guarantees, and applications.", "Research Paper"),
    ("RLHF: Learning to Summarize from Human Feedback. Abstract: We apply reinforcement learning from human feedback to text summarization, training a reward model from preference data and optimizing with PPO.", "Research Paper"),
    ("Emergent Abilities of Large Language Models. Abstract: We survey emergent abilities in large language models — capabilities not present in small models but appearing unpredictably as scale increases.", "Research Paper"),
    ("Toolformer: Language Models Can Teach Themselves to Use Tools. Abstract: We present Toolformer, a model trained to decide which APIs to call, with what arguments, and how to incorporate results into future token prediction.", "Research Paper"),
    ("LangChain: Building Applications with LLMs through Composability. Abstract: We describe a framework for developing applications powered by language models with chains, agents, memory, and retrieval components.", "Research Paper"),
    ("Sparse Transformers: Generating Long Sequences with Sparse Attention. Abstract: We introduce sparse attention patterns that reduce the complexity of attention from quadratic to sub-quadratic enabling longer sequence modeling.", "Research Paper"),
    ("Graph Neural Networks: A Review of Methods and Applications. Abstract: We review GNN architectures including GCN, GAT, GraphSAGE and their applications in social networks, chemistry, biology, and NLP.", "Research Paper"),
    ("Prototypical Networks for Few-Shot Learning. Abstract: We propose prototypical networks learning a metric space in which classification is performed by computing distances to prototype representations of each class.", "Research Paper"),
    ("ELECTRA: Pre-training Text Encoders as Discriminators rather than Generators. Abstract: We propose replaced token detection as a more efficient pre-training task compared to masked language modeling.", "Research Paper"),
    ("Swin Transformer: Hierarchical Vision Transformer using Shifted Windows. Abstract: We present Swin Transformer with shifted window attention and hierarchical feature maps as a general-purpose vision backbone.", "Research Paper"),
    ("DPO: Direct Preference Optimization for Language Model Alignment. Abstract: We introduce DPO, optimizing language model preferences directly from human feedback without reinforcement learning or reward model.", "Research Paper"),
    ("FLAN: Finetuned Language Models are Zero-Shot Learners. Abstract: We show that instruction fine-tuning on 60+ NLP tasks substantially improves zero-shot performance on held-out tasks.", "Research Paper"),
    ("Gemini: A Family of Highly Capable Multimodal Models. Abstract: We report development of Gemini, natively multimodal models pre-trained jointly on text, image, audio, and video data achieving SOTA across benchmarks.", "Research Paper"),
    ("Neural Architecture Search with Reinforcement Learning. Abstract: We use a recurrent network to generate model descriptions of neural networks and train the controller with REINFORCE to maximize validation accuracy.", "Research Paper"),
    ("EfficientNet: Rethinking Model Scaling for Convolutional Neural Networks. Abstract: We propose a compound scaling method uniformly scaling network depth, width, and resolution with fixed coefficients achieving state-of-the-art ImageNet accuracy.", "Research Paper"),
    ("Phi-2: The Surprising Power of Small Language Models. Abstract: We present Phi-2, a 2.7B parameter language model demonstrating state-of-the-art performance among base models of similar size through quality training data.", "Research Paper"),
    ("SentenceTransformers: Sentence-BERT for Semantic Textual Similarity. Abstract: We present SBERT, a modification of BERT using siamese and triplet networks to derive semantically meaningful sentence embeddings.", "Research Paper"),
    ("ZeRO: Memory Optimizations Toward Training Trillion Parameter Models. Abstract: We propose Zero Redundancy Optimizer reducing memory footprint by partitioning optimizer states, gradients, and model parameters.", "Research Paper"),
    ("Instruct-NeRF2NeRF: Editing 3D Scenes with Instructions. Abstract: We present a method for editing neural radiance fields using text instructions by iteratively updating training images with a diffusion model.", "Research Paper"),
    ("Learning Transferable Architectures for Scalable Image Recognition (NASNet). Abstract: We use NAS to search for architectures on small CIFAR-10 dataset and transfer learned cells to ImageNet achieving strong accuracy.", "Research Paper"),
    ("Kolmogorov-Arnold Networks (KAN). Abstract: We propose KANs as an alternative to MLPs based on Kolmogorov-Arnold representation theorem with learnable spline activation functions on edges.", "Research Paper"),
    ("Mamba: Linear-Time Sequence Modeling with Selective State Spaces. Abstract: We present Mamba, a state space model with selective mechanism allowing context-dependent state updates and linear-time inference.", "Research Paper"),
    ("VideoLLaMA: An Instruction-tuned Audio-Visual Language Model for Video Understanding. Abstract: We propose VideoLLaMA enabling temporal video understanding through visual encoder, temporal connector, and LLM backbone.", "Research Paper"),
    ("MoE-LLaVA: Mixture of Experts for Large Vision-Language Models. Abstract: We propose sparse MoE pathway selection for vision-language modeling enabling efficient scaling with multiple expert feed-forward layers.", "Research Paper"),
    ("RLVR: Reinforcement Learning with Verifiable Rewards for LLM Reasoning. Abstract: We train LLMs with verifiable outcome-based reward signals instead of trained reward models, improving mathematical and coding reasoning.", "Research Paper"),
    ("OpenRLHF: An Easy-to-use, Scalable and High Performance RLHF Framework. Abstract: We present an open-source RLHF framework supporting PPO, DPO, GRPO, and SFT with 70B+ parameter models on Ray cluster.", "Research Paper"),
    ("Multimodal RAG for Enterprise Document Intelligence. Abstract: We propose a multimodal retrieval-augmented generation pipeline processing text, tables, charts, and images from enterprise documents using ColPali retrieval.", "Research Paper"),

    # ── CLASS 3: TECHNICAL SPECIFICATION (64 Samples) ─────────────────────────
    ("System Architecture Specification: Microservices deployment using Kubernetes cluster. API gateway latency targets under 50ms, throughput capacity 10,000 requests per second. REST endpoints and GraphQL schema definitions.", "Technical Specification"),
    ("Database Schema and Vector Index Specification. pgvector extension for 1536-dimensional embeddings. HNSW index parameters m=16, ef_construction=64. Sharding and replication topology.", "Technical Specification"),
    ("Network Security Protocol and TLS 1.3 Handshake Architecture. Mutual TLS authentication, certificate rotation, AES-256-GCM cipher suite specification.", "Technical Specification"),
    ("Event-driven streaming pipeline specification. Apache Kafka topic partition strategy, consumer group concurrency, schema registry avro payloads and backpressure handling.", "Technical Specification"),
    ("Distributed cache architecture specification with Redis cluster, memory eviction policies, sentinel failover protocol, and throughput latency thresholds.", "Technical Specification"),
    ("Cloud Infrastructure Specification: Multi-region AWS deployment, Terraform state management, VPC peering, and container orchestration with auto-scaling limits.", "Technical Specification"),
    ("Software Requirements Specification (SRS): Functional requirements, non-functional latency targets, microservices architecture, and API endpoint interfaces.", "Technical Specification"),
    ("Security hardening specification: OAuth2 Bearer token authentication, role-based access control (RBAC), and encryption key management service (KMS).", "Technical Specification"),
    ("API Rate Limiting and Traffic Throttling Specification: Token bucket algorithm, Redis sliding window counter, HTTP 429 Too Many Requests response protocol.", "Technical Specification"),
    ("Object Storage Service Architecture Specification: S3 compatible blob store, multi-part parallel upload, lifecycle eviction rules, and cross-region replication.", "Technical Specification"),
    ("Continuous Integration and Deployment (CI/CD) Pipeline Specification: GitHub Actions workflows, automated unit testing, SonarQube static analysis, and Canary deployment.", "Technical Specification"),
    ("Observability and Telemetry Specification: OpenTelemetry distributed tracing, Prometheus metrics collection, Grafana dashboard visualization, and Alertmanager routing.", "Technical Specification"),
    ("Distributed Consensus Algorithm Specification: Raft protocol leader election, log replication quorum, log compaction snapshots, and network partition resilience.", "Technical Specification"),
    ("Disaster Recovery and High Availability Specification: RPO target < 5 minutes, RTO target < 15 minutes, automated database failover, and active-passive DNS routing.", "Technical Specification"),
    ("GraphQL API Schema and Subscription Specification: WebSocket persistent connections, query depth complexity analysis, dataloader batching, and schema stitching.", "Technical Specification"),
    ("Container Runtime Security Specification: eBPF kernel monitoring, Falco runtime threat detection, read-only root filesystems, and Seccomp syscall filtering.", "Technical Specification"),
    ("Message Queue Architecture Specification: RabbitMQ topology, exchange types (direct, fanout, topic), dead letter queues, and consumer acknowledgment modes.", "Technical Specification"),
    ("Load Balancer and Traffic Distribution Specification: NGINX upstream configuration, weighted round-robin, health check intervals, and sticky session management.", "Technical Specification"),
    ("Data Pipeline ETL Architecture Specification: Apache Spark batch processing, Delta Lake ACID transactions, schema evolution, and partitioning strategy.", "Technical Specification"),
    ("Service Mesh Architecture Specification: Istio control plane, Envoy proxy sidecar injection, mutual TLS, circuit breaker policies, and traffic mirroring.", "Technical Specification"),
    ("Identity and Access Management Specification: OpenID Connect flows, SAML 2.0 federation, JWT token lifetime, refresh token rotation, and session management.", "Technical Specification"),
    ("Machine Learning Model Serving Specification: TorchServe configuration, batch inference parameters, model versioning, A/B traffic splitting, and rollback.", "Technical Specification"),
    ("Relational Database Schema Specification: PostgreSQL table definitions, foreign key constraints, composite indexes, partitioning scheme, and vacuum settings.", "Technical Specification"),
    ("Search Engine Architecture Specification: Elasticsearch cluster topology, index sharding, analyzer pipeline, query DSL, and relevance tuning parameters.", "Technical Specification"),
    ("Asynchronous Job Processing Specification: Celery task queue, priority queues, task retry policies, result backend Redis, and worker concurrency.", "Technical Specification"),
    ("Content Delivery Network (CDN) Specification: Edge cache configuration, origin pull behavior, cache invalidation TTL, CORS headers, and geo-routing rules.", "Technical Specification"),
    ("Data Warehouse Specification: Snowflake schema design, clustering keys, materialized views, query acceleration, and data sharing configuration.", "Technical Specification"),
    ("Real-Time Analytics Pipeline Specification: Apache Flink streaming jobs, watermarking strategy, windowing operations, and sink connector to ClickHouse.", "Technical Specification"),
    ("Mobile Application API Specification: RESTful endpoints, pagination cursors, HTTP/2 multiplexing, certificate pinning, and offline sync protocol.", "Technical Specification"),
    ("Blockchain Integration Specification: Ethereum smart contract ABI, Web3 provider configuration, event subscription, gas estimation, and wallet signing.", "Technical Specification"),
    ("GPU Compute Cluster Specification: NVIDIA A100 SXM4 topology, NVLink interconnect, CUDA 12 runtime, cuDNN library, and MIG partitioning.", "Technical Specification"),
    ("Network Topology Specification: BGP routing protocol, OSPF area design, MPLS label switching, firewall zone policies, and VLAN segmentation.", "Technical Specification"),
    ("Document Processing Pipeline Specification: Apache Tika content extraction, OCR via Tesseract 5.0, language detection, and entity tagging pipeline.", "Technical Specification"),
    ("Notification Service Architecture Specification: FCM push notifications, APNS certificate management, email via SendGrid, SMS via Twilio, and delivery receipts.", "Technical Specification"),
    ("Multi-Tenant SaaS Architecture Specification: Tenant isolation strategies, schema-per-tenant database model, tenant provisioning API, and resource quotas.", "Technical Specification"),
    ("Workflow Orchestration Specification: Apache Airflow DAG design, task dependencies, SLA breach alerting, XCom data passing, and KubernetesPodOperator.", "Technical Specification"),
    ("Feature Store Architecture Specification: Feast feature registry, online store Redis, offline store Parquet, point-in-time join, and feature freshness.", "Technical Specification"),
    ("Infrastructure as Code Specification: Terraform module hierarchy, remote state backend S3, workspace isolation, plan approval gates, and drift detection.", "Technical Specification"),
    ("API Gateway Specification: Kong configuration, plugins for authentication, rate limiting, logging, request transformation, and upstream service routing.", "Technical Specification"),
    ("Edge Computing Architecture Specification: AWS Lambda@Edge function triggers, CloudFront behaviors, cache key normalization, and origin shield configuration.", "Technical Specification"),
    ("Storage Architecture Specification: Ceph distributed block storage, CRUSH map topology, replication factor 3, erasure coding pools, and OSD configuration.", "Technical Specification"),
    ("Secrets Management Specification: HashiCorp Vault dynamic secrets, PKI secret engine, Kubernetes auth backend, lease renewal, and audit logging.", "Technical Specification"),
    ("WebSocket Server Specification: Socket.IO rooms and namespaces, heartbeat interval, reconnection backoff, horizontal scaling with Redis adapter.", "Technical Specification"),
    ("Data Encryption Specification: AES-256-GCM encryption at rest, TLS 1.3 in transit, HSM-backed key storage, key rotation schedule, and FIPS 140-2 compliance.", "Technical Specification"),
    ("Microservices Inter-Communication Specification: gRPC protocol buffers, service discovery Consul, health check endpoints, retry budgets, and circuit breaking.", "Technical Specification"),
    ("Container Orchestration Specification: Kubernetes pod autoscaling HPA/VPA, resource requests and limits, namespace quotas, PodDisruptionBudget, and affinity rules.", "Technical Specification"),
    ("Stream Processing Architecture Specification: Kafka Streams DSL, stateful aggregations, changelog topics, RocksDB state store, and interactive queries.", "Technical Specification"),
    ("Cloud Cost Optimization Specification: Reserved instance procurement, spot instance fleet management, rightsizing recommendations, and tagging taxonomy.", "Technical Specification"),
    ("Zero-Trust Network Architecture Specification: BeyondCorp model, identity-aware proxy, device trust attestation, micro-segmentation, and lateral movement prevention.", "Technical Specification"),
    ("Batch Data Processing Specification: Apache Hadoop MapReduce jobs, YARN resource allocation, HDFS block size, input split configuration, and output committer.", "Technical Specification"),
    ("Frontend Architecture Specification: Next.js App Router, React Server Components, ISR revalidation intervals, CDN caching strategy, and Core Web Vitals targets.", "Technical Specification"),
    ("Database Replication Specification: PostgreSQL streaming replication, WAL shipping, standby promotion playbook, replication slots, and monitoring lag threshold.", "Technical Specification"),
    ("Log Aggregation Architecture Specification: ELK stack deployment, Filebeat shipper configuration, Logstash filter pipeline, index lifecycle policy, and retention.", "Technical Specification"),
    ("Automated Testing Architecture Specification: Pytest framework, test coverage threshold 80%, integration test Docker Compose environment, and contract testing Pact.", "Technical Specification"),
    ("SLO and Error Budget Specification: 99.95% availability target, error rate budget calculation, burn rate alerting thresholds, and toil reduction targets.", "Technical Specification"),
    ("Service Catalog and API Registry Specification: Backstage configuration, component metadata schema, API documentation OpenAPI 3.1, and ownership mapping.", "Technical Specification"),
    ("Cross-Region Failover Specification: AWS Route 53 health checks, latency-based routing, failover record sets, and automated runbook for regional failure.", "Technical Specification"),
    ("Data Governance Specification: Apache Atlas metadata catalog, lineage tracking, classification policies, data quality rules, and PII tagging.", "Technical Specification"),
    ("Authentication Service Specification: Keycloak realm configuration, social identity providers, MFA enforcement, brute force protection, and session limits.", "Technical Specification"),
    ("Embedded Systems Firmware Specification: RTOS task scheduling, memory map layout, peripheral driver interfaces, watchdog timer, and OTA update protocol.", "Technical Specification"),
    ("Protocol Buffer Schema Specification: Proto3 syntax, field numbering conventions, backward compatibility rules, oneof fields, and well-known types.", "Technical Specification"),
    ("Distributed Tracing Specification: Jaeger deployment, trace sampling rate, span attribute standards, baggage propagation, and integration with Prometheus.", "Technical Specification"),
    ("Build System Specification: Bazel monorepo build targets, remote caching configuration, hermetic builds, dependency management, and test sharding.", "Technical Specification"),
    ("Machine Learning Training Infrastructure Specification: Kubernetes training jobs, distributed PyTorch DDP, mixed precision FP16, gradient checkpointing, and checkpoint storage.", "Technical Specification"),
]

# Benchmark Test Data (20 Representative Samples — 5 per class)
TEST_DATA = [
    # Legal Contract (5)
    ("Executive employment agreement with $310,000 salary, restrictive covenant non-compete for 24 months, and termination severance terms.", "Legal Contract"),
    ("Vendor master service agreement covering non-disclosure, intellectual property ownership, and liability caps.", "Legal Contract"),
    ("Software end-user license agreement granting non-exclusive rights with warranty disclaimer, limitation of liability, and governing law clause.", "Legal Contract"),
    ("Joint venture shareholders agreement detailing profit distribution, board composition, exit rights, and dispute resolution arbitration.", "Legal Contract"),
    ("Data processing agreement specifying controller-processor obligations, sub-processor approvals, and GDPR Article 28 compliance requirements.", "Legal Contract"),
    # Financial Invoice (5)
    ("Invoice INV-8821 total amount due $19,500.00 USD. Subtotal $18,000 plus tax, payment due September 30, 2026.", "Financial Invoice"),
    ("Recurring cloud computing infrastructure invoice for server compute instances total balance $14,200.00.", "Financial Invoice"),
    ("Professional services invoice #PS-2026-441. 60 hours billed at $175 per hour. Subtotal $10,500 plus VAT. Total due $12,075.00.", "Financial Invoice"),
    ("Quarterly maintenance and support billing statement. SLA contract renewal, 3 servers, total payable amount $8,750.00 net 30 days.", "Financial Invoice"),
    ("Construction materials supply invoice. Concrete, rebar, and formwork for Phase 2. Total amount due $97,400.00. Payment via bank transfer.", "Financial Invoice"),
    # Research Paper (5)
    ("Abstract: A comparative evaluation of transformer embeddings on scientific literature QA. Methodology, dataset, and precision-recall benchmark results.", "Research Paper"),
    ("Abstract: Empirical benchmark of low-rank adaptation methods for parameter-efficient fine-tuning on domain datasets.", "Research Paper"),
    ("Abstract: We introduce a novel contrastive pre-training objective for multimodal document encoders evaluated on VQA, DocVQA, and InfoVQA benchmarks.", "Research Paper"),
    ("Abstract: A systematic study of prompt engineering strategies for zero-shot chain-of-thought reasoning in mathematical problem solving with LLMs.", "Research Paper"),
    ("Abstract: We propose a graph-based citation network analysis method for scientific paper clustering and recommendation using GNN and contrastive learning.", "Research Paper"),
    # Technical Specification (5)
    ("System requirements specification: API gateway throughput 5,000 req/sec with sub-20ms p99 response latency.", "Technical Specification"),
    ("Container deployment specification: Docker image build pipeline, Helm chart values, Kubernetes namespace isolation, and resource limit enforcement.", "Technical Specification"),
    ("Data retention and archival specification: S3 Glacier lifecycle rules, compliance hold periods, legal hold override, and audit trail logging.", "Technical Specification"),
    ("Event sourcing architecture specification: CQRS pattern, aggregate root design, event store PostgreSQL schema, and projection rebuild procedure.", "Technical Specification"),
    ("CI/CD pipeline specification: GitLab CI stages, Docker registry, Helm rollout strategy, smoke test gates, and rollback triggers.", "Technical Specification"),
]


def load_training_data():
    """Load base dataset merged with real-time dynamic uploaded documents."""
    data = list(BASE_TRAINING_DATA)
    if os.path.exists(LIVE_DATA_FILE):
        try:
            with open(LIVE_DATA_FILE, 'r', encoding='utf-8') as f:
                live_items = json.load(f)
                for item in live_items:
                    if isinstance(item, dict) and 'text' in item and 'label' in item:
                        data.append((item['text'], item['label']))
        except Exception as e:
            sys.stderr.write(f"Warning: Could not read live_dataset.json: {e}\n")
    return data


def ingest_live_document(text, label):
    """Store new real-time document text into live_dataset.json for online training."""
    live_items = []
    if os.path.exists(LIVE_DATA_FILE):
        try:
            with open(LIVE_DATA_FILE, 'r', encoding='utf-8') as f:
                live_items = json.load(f)
        except Exception:
            live_items = []

    live_items.append({"text": text, "label": label, "ingested_at": str(os.getenv("CURRENT_TIME", "realtime"))})
    with open(LIVE_DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(live_items, f, indent=2)
    return len(live_items)


def tokenize(text):
    words = [w.lower().strip(".,()[]{}:;\"'$#") for w in text.split() if len(w) > 2]
    bigrams = [f"{words[i]}_{words[i+1]}" for i in range(len(words)-1)]
    return words + bigrams


class TFIDFNaiveBayesClassifier:
    def __init__(self):
        self.classes = []
        self.class_priors = {}
        self.word_probs = defaultdict(lambda: defaultdict(float))
        self.vocab = set()

    def train(self, data):
        self.classes = sorted(list(set([label for _, label in data])))
        total_docs = len(data)
        doc_counts = Counter([label for _, label in data])

        for c in self.classes:
            self.class_priors[c] = doc_counts[c] / total_docs

        class_word_counts = defaultdict(Counter)
        class_total_words = defaultdict(int)

        for text, label in data:
            tokens = tokenize(text)
            for token in tokens:
                self.vocab.add(token)
                class_word_counts[label][token] += 1
                class_total_words[label] += 1

        vocab_size = len(self.vocab)
        for c in self.classes:
            for word in self.vocab:
                count = class_word_counts[c][word]
                self.word_probs[c][word] = (count + 1) / (class_total_words[c] + vocab_size)

    def predict(self, text):
        tokens = tokenize(text)
        all_probs = {}

        for c in self.classes:
            log_prob = math.log(self.class_priors[c])
            for token in tokens:
                if token in self.vocab:
                    log_prob += math.log(self.word_probs[c][token])
            all_probs[c] = log_prob

        max_lp = max(all_probs.values())
        exp_probs = {c: math.exp(lp - max_lp) for c, lp in all_probs.items()}
        sum_exp = sum(exp_probs.values())
        normalized = {c: exp_probs[c] / sum_exp for c in self.classes}

        sorted_res = sorted(normalized.items(), key=lambda x: x[1], reverse=True)
        return sorted_res[0][0], sorted_res[0][1], sorted_res


def compute_per_class_metrics(y_true, y_pred, classes):
    """Compute precision, recall, F1-score, and support per class."""
    metrics = {}
    for cls in classes:
        tp = sum(1 for t, p in zip(y_true, y_pred) if t == cls and p == cls)
        fp = sum(1 for t, p in zip(y_true, y_pred) if t != cls and p == cls)
        fn = sum(1 for t, p in zip(y_true, y_pred) if t == cls and p != cls)
        support = sum(1 for t in y_true if t == cls)
        precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
        recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        f1 = (2 * precision * recall / (precision + recall)) if (precision + recall) > 0 else 0.0
        metrics[cls] = {"precision": precision, "recall": recall, "f1": f1, "support": support}
    return metrics


def run_evaluation():
    training_data = load_training_data()
    print("=" * 70)
    print("  DocuSense AI -- Machine Learning Pipeline Training & Evaluation")
    print("  Thakur College of Engineering & Technology (TCET), Mumbai")
    print("=" * 70)
    print(f"[*] Base Dataset Documents: {len(BASE_TRAINING_DATA)}")
    print(f"[*] Real-Time Dynamic Ingested: {len(training_data) - len(BASE_TRAINING_DATA)}")
    print(f"[*] Total Training Documents:   {len(training_data)}")
    print(f"[*] Testing Documents:          {len(TEST_DATA)}")
    print(f"[*] Target Classes:             4 Classes")

    clf = TFIDFNaiveBayesClassifier()

    start = time.time()
    clf.train(training_data)
    elapsed = time.time() - start

    print("[+] Model Trained: Real-Time Dynamic TF-IDF + Naive Bayes")
    print(f"[+] Training Time: {elapsed * 1000:.1f}ms")
    print(f"[+] Total Vocabulary Size: {len(clf.vocab)} unique features\n")

    print("-" * 70)
    print("  TEST SET PREDICTION & CLASSIFICATION EVALUATION")
    print("-" * 70)
    correct = 0
    y_true = []
    y_pred = []

    for idx, (text, actual) in enumerate(TEST_DATA, 1):
        pred_label, conf, _ = clf.predict(text)
        is_correct = (pred_label == actual)
        if is_correct:
            correct += 1
        y_true.append(actual)
        y_pred.append(pred_label)
        status = "[PASS]" if is_correct else "[FAIL]"
        print(f"Sample {idx}: {status}")
        print(f"  Snippet:      \"{text[:55]}...\"")
        print(f"  Ground Truth: {actual}")
        print(f"  Predicted:    {pred_label} (Confidence: {conf*100:.1f}%)\n")

    accuracy = (correct / len(TEST_DATA)) * 100
    print(f"==> Overall Test Accuracy: {accuracy:.1f}%\n")

    # ── Per-Class F1 Report ───────────────────────────────────────────────────
    classes = sorted(set(y_true))
    per_class = compute_per_class_metrics(y_true, y_pred, classes)

    print("-" * 70)
    print("  PER-CLASS CLASSIFICATION REPORT")
    print("-" * 70)
    header = f"{'Class':<30} {'Precision':>9} {'Recall':>9} {'F1-Score':>9} {'Support':>8}"
    print(header)
    print("-" * 70)
    for cls in classes:
        m = per_class[cls]
        print(f"{cls:<30} {m['precision']:>9.3f} {m['recall']:>9.3f} {m['f1']:>9.3f} {m['support']:>8d}")
    print("-" * 70)

    # Macro averages
    macro_p = sum(m['precision'] for m in per_class.values()) / len(classes)
    macro_r = sum(m['recall'] for m in per_class.values()) / len(classes)
    macro_f1 = sum(m['f1'] for m in per_class.values()) / len(classes)
    total_support = sum(m['support'] for m in per_class.values())
    print(f"{'Macro Average':<30} {macro_p:>9.3f} {macro_r:>9.3f} {macro_f1:>9.3f} {total_support:>8d}")
    print("=" * 70)


if __name__ == "__main__":
    if len(sys.argv) >= 4 and sys.argv[1] == "--ingest":
        # Ingest real-time document text: python ml/train_and_evaluate.py --ingest "text" "label"
        text_arg = sys.argv[2]
        label_arg = sys.argv[3]
        total_live = ingest_live_document(text_arg, label_arg)
        print(json.dumps({"status": "ingested", "total_live_documents": total_live}))
    elif len(sys.argv) >= 3 and sys.argv[1] == "--classify":
        text_to_classify = " ".join(sys.argv[2:])
        training_data = load_training_data()

        clf = TFIDFNaiveBayesClassifier()
        clf.train(training_data)

        pred_label, confidence, all_probs = clf.predict(text_to_classify)
        result = {
            "predicted_class": pred_label,
            "confidence": round(confidence, 4),
            "all_scores": {cls: round(prob, 4) for cls, prob in all_probs},
            "training_sample_count": len(training_data)
        }
        print(json.dumps(result))
    else:
        run_evaluation()

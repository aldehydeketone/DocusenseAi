export type ProcessingStatus = 
  | 'uploading'
  | 'queued'
  | 'processing'
  | 'extracting_text'
  | 'chunking'
  | 'embedding'
  | 'ready'
  | 'failed';

export type FileType = 'pdf' | 'docx' | 'txt' | 'csv' | 'image';

export interface DocumentChunk {
  id: string;
  documentId: string;
  documentTitle: string;
  pageNumber: number;
  sectionTitle?: string;
  chunkIndex: number;
  text: string;
  tokenCount: number;
  embedding?: number[];
}

export interface Document {
  id: string;
  title: string;
  fileName: string;
  fileSize: number;
  fileType: FileType;
  pageCount: number;
  chunkCount: number;
  status: ProcessingStatus;
  uploadedAt: string;
  processedAt?: string;
  collectionId?: string;
  workspaceId: string;
  author?: string;
  summaryQuick?: string[];
  summaryExec?: {
    purpose: string;
    findings: string[];
    numbers: string[];
    dates: string[];
    risks: string[];
    recommendations: string[];
  };
  summaryDetailed?: { section: string; summary: string }[];
  summaryTldr?: string;
}

export interface Citation {
  id: string;
  messageId: string;
  documentId: string;
  documentTitle: string;
  pageNumber: number;
  sectionTitle?: string;
  snippet: string;
  confidence: number;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: Citation[];
  suggestedFollowups?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  workspaceId: string;
  documentIds: string[];
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
}

export interface ExtractionSchemaField {
  key: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'array' | 'object';
  description: string;
}

export interface ExtractionSchema {
  id: string;
  name: string;
  description: string;
  fields: ExtractionSchemaField[];
}

export interface ExtractedResult {
  documentId: string;
  documentTitle: string;
  schemaId: string;
  extractedAt: string;
  data: Record<string, any>;
  confidence: number;
}

export interface DocumentDifference {
  topic: string;
  docAValue: string;
  docBValue: string;
  differenceType: 'clause' | 'date' | 'amount' | 'obligation' | 'contradiction';
  citationDocA: { page: number; snippet: string };
  citationDocB: { page: number; snippet: string };
}

export interface SmartInsight {
  id: string;
  documentId: string;
  documentTitle: string;
  category: 'date' | 'financial' | 'entity' | 'risk';
  label: string;
  value: string;
  pageNumber: number;
  contextSnippet: string;
  severity?: 'low' | 'medium' | 'high';
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  documentCount: number;
  createdAt: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  workspaceName: string;
  avatarUrl?: string;
}

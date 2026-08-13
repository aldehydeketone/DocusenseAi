import { Document, DocumentChunk, ProcessingStatus } from '../types';

export class ProcessingPipeline {
  /**
   * Simulates idempotent processing pipeline for uploaded files
   */
  public static async processDocument(
    file: { name: string; size: number; type: string; content?: string },
    onProgress?: (status: ProcessingStatus, progressPercent: number) => void
  ): Promise<Document> {
    const docId = `doc-${Date.now()}`;
    const fileType = file.name.endsWith('.pdf')
      ? 'pdf'
      : file.name.endsWith('.docx')
      ? 'docx'
      : file.name.endsWith('.csv')
      ? 'csv'
      : 'txt';

    const newDoc: Document = {
      id: docId,
      title: file.name.replace(/\.[^/.]+$/, ''),
      fileName: file.name,
      fileSize: file.size,
      fileType,
      pageCount: Math.max(1, Math.ceil(file.size / 150000)),
      chunkCount: Math.max(2, Math.ceil(file.size / 50000)),
      status: 'uploading',
      uploadedAt: new Date().toISOString(),
      workspaceId: 'ws-default',
      author: 'Current User',
    };

    // Step 1: Uploading
    if (onProgress) onProgress('uploading', 15);

    // Step 2: Extracting Text
    if (onProgress) onProgress('extracting_text', 40);

    // Step 3: Chunking
    if (onProgress) onProgress('chunking', 70);

    // Step 4: Embedding
    if (onProgress) onProgress('embedding', 90);

    // Step 5: Ready
    newDoc.status = 'ready';
    newDoc.processedAt = new Date().toISOString();
    newDoc.summaryQuick = [
      `Successfully processed document '${file.name}'.`,
      `Extracted ${newDoc.pageCount} pages and indexed ${newDoc.chunkCount} semantic chunks.`,
      `Document vector embeddings generated and available for grounded RAG query search.`,
    ];
    newDoc.summaryTldr = `Document ${file.name} ready for semantic chat, information extraction, and citation mapping.`;

    if (onProgress) onProgress('ready', 100);

    return newDoc;
  }
}

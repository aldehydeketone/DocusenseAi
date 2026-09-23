import { Document, DocumentChunk, Collection, Conversation, Message, DocumentAccuracyHistory } from '../types';
import { INITIAL_DOCUMENTS, INITIAL_CHUNKS, INITIAL_COLLECTIONS, INITIAL_ACCURACY_HISTORY } from './store';

// Client-side local storage key names
const KEYS = {
  DOCUMENTS: 'docusense_docs',
  CHUNKS: 'docusense_chunks',
  COLLECTIONS: 'docusense_collections',
  CONVERSATIONS: 'docusense_conversations',
  GEMINI_KEY: 'docusense_gemini_key',
};

const DEFAULT_KEY_B64 = 'QVEuQWI4Uk42TFVCNHZjTW8ydFVVeWFLVGlvMkJSeVAxNTlteVpUVlBOc0wxN3g5aVNqdXc=';

export const getGeminiKey = (): string => {
  const custom = getStorageItem<string>(KEYS.GEMINI_KEY, '');
  if (custom && custom.trim().length > 5) return custom;
  try {
    return typeof atob !== 'undefined' ? atob(DEFAULT_KEY_B64) : Buffer.from(DEFAULT_KEY_B64, 'base64').toString('utf-8');
  } catch {
    return '';
  }
};

export const saveGeminiKey = (key: string): void => {
  setStorageItem(KEYS.GEMINI_KEY, key);
};

// Helper: safe SSR-compatible localStorage retrieval
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return defaultValue;
  }
};

// Helper: safe SSR-compatible localStorage writing
const setStorageItem = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Trigger custom storage event for live syncing across components
    window.dispatchEvent(new Event('docusense_store_update'));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
};

export const getDocuments = (): Document[] => {
  return getStorageItem<Document[]>(KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
};

export const saveDocuments = (docs: Document[]): void => {
  setStorageItem(KEYS.DOCUMENTS, docs);
};

export const addDocument = (doc: Document): void => {
  const docs = getDocuments();
  const index = docs.findIndex((d) => d.id === doc.id);
  if (index !== -1) {
    docs[index] = doc;
  } else {
    docs.unshift(doc);
  }
  saveDocuments(docs);
};

export const getChunks = (): DocumentChunk[] => {
  return getStorageItem<DocumentChunk[]>(KEYS.CHUNKS, INITIAL_CHUNKS);
};

export const saveChunks = (chunks: DocumentChunk[]): void => {
  setStorageItem(KEYS.CHUNKS, chunks);
};

export const addChunks = (newChunks: DocumentChunk[]): void => {
  const current = getChunks();
  saveChunks([...newChunks, ...current]);
};

export const getCollections = (): Collection[] => {
  return getStorageItem<Collection[]>(KEYS.COLLECTIONS, INITIAL_COLLECTIONS);
};

export const saveCollections = (collections: Collection[]): void => {
  setStorageItem(KEYS.COLLECTIONS, collections);
};

export const getConversations = (): Conversation[] => {
  return getStorageItem<Conversation[]>(KEYS.CONVERSATIONS, []);
};

export const saveConversations = (conversations: Conversation[]): void => {
  setStorageItem(KEYS.CONVERSATIONS, conversations);
};

export const addConversationMessage = (conversationId: string, message: Message): void => {
  const conversations = getConversations();
  const convIndex = conversations.findIndex((c) => c.id === conversationId);
  
  if (convIndex !== -1) {
    const conv = conversations[convIndex];
    if (!conv.messages) {
      conv.messages = [];
    }
    conv.messages.push(message);
    conv.updatedAt = new Date().toISOString();
  } else {
    conversations.unshift({
      id: conversationId,
      title: message.content.slice(0, 30) + '...',
      messages: [message],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      workspaceId: 'ws-default',
      documentIds: [],
    });
  }
  saveConversations(conversations);
};

export const getAccuracyHistory = (): DocumentAccuracyHistory[] => {
  return getStorageItem<DocumentAccuracyHistory[]>('docusense_accuracy_history', INITIAL_ACCURACY_HISTORY);
};

export const saveAccuracyHistory = (history: DocumentAccuracyHistory[]): void => {
  setStorageItem('docusense_accuracy_history', history);
};

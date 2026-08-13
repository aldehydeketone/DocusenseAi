'use client';

import { Document, Collection, Conversation, Message } from '../types';
import { INITIAL_DOCUMENTS, INITIAL_COLLECTIONS } from './store';

// Client-side local storage key names
const KEYS = {
  DOCUMENTS: 'docusense_docs',
  COLLECTIONS: 'docusense_collections',
  CONVERSATIONS: 'docusense_conversations',
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
    conversations[convIndex].messages.push(message);
    conversations[convIndex].updatedAt = new Date().toISOString();
  } else {
    conversations.unshift({
      id: conversationId,
      title: message.text.slice(0, 30) + '...',
      messages: [message],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      workspaceId: 'ws-default',
    });
  }
  saveConversations(conversations);
};

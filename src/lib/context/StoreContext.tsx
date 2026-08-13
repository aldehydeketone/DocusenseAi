'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Document, Collection } from '../types';
import { getDocuments, saveDocuments, getCollections, saveCollections } from '../db/clientStore';

interface StoreContextType {
  documents: Document[];
  collections: Collection[];
  isUploadOpen: boolean;
  setIsUploadOpen: (open: boolean) => void;
  addDocument: (doc: Document) => void;
  deleteDocument: (id: string) => void;
  refreshStore: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocumentsState] = useState<Document[]>([]);
  const [collections, setCollectionsState] = useState<Collection[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const refreshStore = () => {
    setDocumentsState(getDocuments());
    setCollectionsState(getCollections());
  };

  // Load store on mount and listen to updates
  useEffect(() => {
    refreshStore();
    
    const handleUpdate = () => {
      refreshStore();
    };

    window.addEventListener('docusense_store_update', handleUpdate);
    return () => {
      window.removeEventListener('docusense_store_update', handleUpdate);
    };
  }, []);

  const addDocument = (doc: Document) => {
    const updated = [doc, ...documents.filter((d) => d.id !== doc.id)];
    setDocumentsState(updated);
    saveDocuments(updated);
  };

  const deleteDocument = (id: string) => {
    const updated = documents.filter((d) => d.id !== id);
    setDocumentsState(updated);
    saveDocuments(updated);
  };

  return (
    <StoreContext.Provider
      value={{
        documents,
        collections,
        isUploadOpen,
        setIsUploadOpen,
        addDocument,
        deleteDocument,
        refreshStore,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

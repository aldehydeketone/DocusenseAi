export type DocumentCategory = 
  | 'Legal Contract'
  | 'Financial Invoice'
  | 'Research Paper'
  | 'Technical Specification'
  | 'General Document';

export type EntityType = 
  | 'MONEY'
  | 'DATE'
  | 'ORG'
  | 'PERSON'
  | 'RISK_CLAUSE';

export interface MLEntity {
  id: string;
  text: string;
  type: EntityType;
  startOffset: number;
  endOffset: number;
  confidence: number; // e.g. 0.94 (94%)
  contextSnippet: string;
  pageNumber?: number;
}

export interface MLClassificationResult {
  category: DocumentCategory;
  confidence: number; // e.g. 0.96 (96%)
  probabilities: {
    category: DocumentCategory;
    probability: number;
  }[];
  topFeatureKeywords: {
    keyword: string;
    weight: number;
  }[];
}

export interface MLModelMetrics {
  nerModel: {
    name: string;
    version: string;
    architecture: string;
    precision: number;
    recall: number;
    f1Score: number;
    evaluatedTokens: number;
  };
  classifierModel: {
    name: string;
    version: string;
    algorithm: string;
    accuracy: number;
    macroF1: number;
    classes: DocumentCategory[];
    confusionMatrix: {
      classes: string[];
      matrix: number[][]; // rows: actual, cols: predicted
    };
  };
}

// import { Model } from '@/types/model.types';

export interface ImageResult {
  imageUrl: string;
  results: {
    modelId: number;
    modelName: string;
    result: {
      class?: string;
      confidence?: string;
      maskUrl?: string;
    };
  }[];
}

export interface MultiResults {
  [modelId: number]: {
    [imageUrl: string]: {
      class?: string;
      confidence?: string;
      maskUrl?: string;
    };
  };
}

export interface ClassificationResult {
  class: string;
  confidence: string;
}

export interface SegmentationResult {
  maskUrl: string;
}

export type ModelResult = ClassificationResult | SegmentationResult;
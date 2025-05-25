import { Feedback } from "./feedback.types";

// Типы для модели
export interface ModelParams {
  architecture: string;
  accuracy: string;
  inferenceTime: string;
  inputSize: string;
}

export interface Model {
  id: number;
  name: string;
  description: string;
  taskType: string;
  parameters?: ModelParams;
}

export interface Result {
  modelId: number;
  modelName: string;
  result: {
    class?: string;
    confidence?: string;
    maskUrl?: string;
  };
}

export interface DeveloperModel extends Model {
  architecture: string;
  accuracy: string;
  inferenceTime: string;
  inputSize: string;
  file?: string;
  feedbacks: Feedback[];
}
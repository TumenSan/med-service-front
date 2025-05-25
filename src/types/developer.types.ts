import { Feedback } from "./feedback.types";

export interface Developer {
  id: number;
  name: string;
  description: string;
  taskType: string;
  architecture: string;
  accuracy: string;
  inferenceTime: string;
  inputSize: string;
  file?: string;
  feedbacks: Feedback[];
}

export interface DeveloperModel {
  id: number;
  name: string;
  description: string;
  taskType: string;
  architecture: string;
  accuracy: string;
  inferenceTime: string;
  inputSize: string;
  file?: string;
  feedbacks: Feedback[];
}
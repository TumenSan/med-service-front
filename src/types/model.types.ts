import { Feedback } from "./feedback.types";

// Типы для модели
export interface Model {
  id: number;
  name: string;
  description: string;
  taskType: 'classification' | 'segmentation';
  parameters: {
    architecture: string; // например: ResNet-50, U-Net
    accuracy: string; // например: 92%
    inferenceTime: string; // например: 38ms
    inputSize: string; // например: 224x224
    framework?: string; // например: PyTorch, TensorFlow
    dataset?: string; // например: ImageNet, Custom Horse Dataset
    license?: string; // например: MIT, Apache
    size?: string; // например: 150MB
    supportedDevices?: string[]; // например: ['GPU', 'CPU']
    updatedAt?: string; // например: 2024-09-20
    tags?: string[]; // например: ['fast', 'accurate']
    version?: string; // Версия модели: v1.2.3
    author?: string; // Автор модели
    sourceCode?: string; // Ссылка на GitHub
    documentation?: string; // Ссылка на документацию
  };
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
  file?: string;
  feedbacks: Feedback[];
}
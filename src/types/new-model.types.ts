// Типы формы добавления модели

export interface NewModelData {
  name: string;
  description: string;
  taskType: string;
  architecture: string;
  accuracy: string;
  inferenceTime: string;
  inputSize: string;
  mime: string;
}
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
  framework?: string; // например: PyTorch, TensorFlow
  dataset?: string; // например: ImageNet, Custom Horse Dataset
  license?: string; // например: MIT, Apache
  size?: string; // например: 150MB
  supportedDevices?: string[]; // например: ['GPU', 'CPU']
  tags?: string; // например: ['fast', 'accurate']
  version?: string; // Версия модели: v1.2.3
  sourceCode?: string; // Ссылка на GitHub
  documentation?: string; // Ссылка на документацию
}
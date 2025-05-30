"use client"

// import Image from "next/image";
import { useState } from 'react';
import Header from '@/components/Header';
import TabNavigation from '@/components/TabNavigation';
import Footer from '@/components/Footer';
// import DarkModeToggle from '@/components/DarkModeToggle';
// import DeveloperModelCard from '@/components/models/DeveloperModelCard';
// import FeedbackCard from '@/components/models/FeedbackCard';
import ModelCard from '@/components/models/ModelCard';
import ModelResults from '@/components/models/ModelResults';
// import RatingStars from '@/components/models/RatingStars';
import FeedbackTab from '@/components/tabs/FeedbackTab';

import { Model, DeveloperModel } from '@/types/model.types';
import { NewModelData } from '@/types/new-model.types';
import { ModelResult } from '@/types/results.types';

interface Result {
  modelId: number;
  modelName: string;
  result: {
    class?: string; // Для классификации
    confidence?: string; // Для классификации
    maskUrl?: string; // Для сегментации
  };
}


const Home: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [developerSubTab, setDeveloperSubTab] = useState<string>('upload');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [taskType, setTaskType] = useState<string>('');
  const [selectedModels, setSelectedModels] = useState<Model[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [selectedFeedbackModel, setSelectedFeedbackModel] = useState<DeveloperModel | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Генерация mock-результатов
  const generateMockResult = (type: string): Result['result'] => {
    switch (type) {
      case 'classification':
        return {
          class: ['Horse', 'Zebra', 'Other'][Math.floor(Math.random() * 3)],
          confidence: (Math.random() * 0.5 + 0.5).toFixed(2),
        };
      case 'segmentation':
        return {
          maskUrl: `https://placehold.co/600x400/FFD700/FFFFFF?text=Mask+ ${Math.floor(Math.random() * 100)}`,
        };
      default:
        return {};
    }
  };

  const runModels = () => {
    if (!uploadedImage || selectedModels.length === 0) return;
    const mockResults = selectedModels.map(model => ({
      modelId: model.id,
      modelName: model.name,
      result: generateMockResult(model.taskType),
    }));
    setResults(mockResults);
  };

  // Модели для выбора пользователя
  const availableModels: Model[] = [
    {
    id: 1,
    name: 'HorseNet',
    description: 'Модель классификации лошадей',
    taskType: 'classification',
    parameters: {
      architecture: 'ResNet-50',
      accuracy: '92%',
      inferenceTime: '38ms',
      inputSize: '224x224',
      mime: 'png',
      framework: 'PyTorch',
      dataset: 'ImageNet + Custom Horse Dataset',
      license: 'MIT',
      size: '150MB',
      supportedDevices: ['GPU', 'CPU'],
      updatedAt: '2024-09-20',
      tags: ['fast', 'accurate', 'cpu-friendly'],
      version: 'v1.0.0',
      author: 'Developer 1',
      sourceCode: 'https://github.com/Developer_1/horsenet',
      documentation: 'https://horsenet.io'
    }
    },
    {
      id: 2,
      name: 'HorseZebraN',
      description: 'Модель классификации лошадей и зебр',
      taskType: 'classification',
      parameters: {
        architecture: 'ResNet-70',
        accuracy: '90%',
        inferenceTime: '50ms',
        inputSize: '224x224',
        mime: 'png',
        framework: 'TensorFlow',
        dataset: 'Custom Zebra-Horse Dataset',
        license: 'Apache-2.0',
        size: '200MB',
        supportedDevices: ['GPU', 'TPU'],
        updatedAt: '2024-08-15',
        tags: ['multi-class', 'high-memory'],
        version: 'v2.1.0',
        author: 'Developer 2',
      }
    },
    {
      id: 3,
      name: 'ZebraSegmenter',
      description: 'Сегментация изображений с зебрами',
      taskType: 'segmentation',
      parameters: {
        architecture: 'U-Net',
        accuracy: '87%',
        inferenceTime: '120ms',
        inputSize: '512x512',
        mime: 'png',
        framework: 'ONNX',
        dataset: 'Zebras Segmentation Dataset',
        license: 'CC-BY-NC',
        size: '80MB',
        supportedDevices: ['mobile', 'CPU'],
        updatedAt: '2024-07-10',
        tags: ['lightweight', 'mobile', 'segmentation'],
        author: 'Developer 3',
      }
    }
  ];

  // Фильтруем модели по запросу и типу задачи
  const filteredModels = availableModels.filter(model => {
    const matchesSearch = 
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (model.parameters.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ?? false);

    const matchesTaskType = taskType === '' || model.taskType === taskType;

    return matchesSearch && matchesTaskType;
  });

  // Загруженные модели от разработчика
  const [developerModels, setDeveloperModels] = useState<DeveloperModel[]>([
  {
    id: 101,
    name: 'Custom Horse Classifier',
    description: 'Разработанная пользователем модель для классификации лошадей',
    taskType: 'classification',
    parameters: {
      mime: 'png',
      architecture: 'MobileNet-V2',
      accuracy: '88%',
      inferenceTime: '25ms',
      inputSize: '224x224',
    },
    file: 'mobilenet-horse-classifier.onnx',
    feedbacks: [
      {
        id: 1,
        rating: 4,
        comment: 'Хорошая точность, но иногда путает молодых жеребят с зебрами.',
        image: 'https://placehold.co/300x200/FFE4B2/000000?text=Sample+Image ',
        errorRegion: { x: 80, y: 60, width: 50, height: 40 }
      },
      {
        id: 2,
        rating: 5,
        comment: 'Отличная модель! Работает быстро и точно.',
        image: null,
        errorRegion: undefined
      }
    ]
  },
  {
    id: 102,
    name: 'Custom Horse segmentation',
    description: 'Разработанная пользователем модель для сегментации лошадей',
    taskType: 'segmentation',
    parameters: {
      mime: 'png',
      architecture: 'MobileNet-V2',
      accuracy: '80%',
      inferenceTime: '50ms',
      inputSize: '224x224',
    },
    file: 'mobilenet-horse-segmenter.onnx',
    feedbacks: [
      {
        id: 1,
        rating: 4,
        comment: 'Хорошая точность, но иногда путает молодых жеребят с зебрами.',
        image: 'https://placehold.co/300x200/FFE4B2/000000?text=Sample+Image ',
        errorRegion: { x: 80, y: 60, width: 50, height: 40 }
      },
      {
        id: 2,
        rating: 5,
        comment: 'Отличная модель! Работает быстро и точно.',
        image: null,
        errorRegion: undefined
      }
    ]
  }
]);

  // Данные формы добавления модели
  const [newModelData, setNewModelData] = useState<NewModelData>({
    name: '',
    description: '',
    taskType: '',
    architecture: '',
    accuracy: '',
    inferenceTime: '',
    inputSize: '',
    mime:'',
    framework: '', 
    dataset: '', 
    license: '', 
    size: '', 
    supportedDevices: [],  
    tags: '', 
    version: '',
    sourceCode: '',
    documentation: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileError, setFileError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewModelData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['application/octet-stream', 'application/h5'];
    if (!validTypes.includes(file.type)) {
      setFileError('Недопустимый формат файла. Поддерживаются только .onnx и .h5');
      setSelectedFile(null);
      setFileName('');
      return;
    }

    setFileError('');
    setSelectedFile(file);
    setFileName(file.name);
  };

  const handleSubmit = () => {
    if (!newModelData.name || !newModelData.taskType || !selectedFile) {
      alert('Заполните все поля и загрузите файл модели.');
      return;
    }

    const taskType = newModelData.taskType as 'classification' | 'segmentation';

    const newModel: DeveloperModel = {
    id: Date.now(),
    name: newModelData.name,
    description: newModelData.description,
    taskType: taskType,
    parameters: {
      mime: newModelData.mime,
      architecture: newModelData.architecture,
      accuracy: newModelData.accuracy,
      inferenceTime: newModelData.inferenceTime,
      inputSize: newModelData.inputSize,
      framework: newModelData.framework, // например: PyTorch, TensorFlow
      dataset: newModelData.dataset, // например: ImageNet, Custom Horse Dataset
      license: newModelData.license, // например: MIT, Apache
      size: newModelData.size, // например: 150MB
      supportedDevices: newModelData.supportedDevices, // например: ['GPU', 'CPU']
      tags: newModelData.tags ? newModelData.tags.split(',').map(tag => tag.trim()) : undefined, // например: ['fast', 'accurate']
      version: newModelData.version, // Версия модели: v1.2.3
      sourceCode: newModelData.sourceCode, // Ссылка на GitHub
      documentation: newModelData.documentation // Ссылка на документацию
    },
    file: fileName,
    feedbacks: []
  };

    setDeveloperModels([...developerModels, newModel]);
    setNewModelData({
      name: '',
      description: '',
      taskType: '',
      architecture: '',
      accuracy: '',
      inferenceTime: '',
      framework: '',
      inputSize: '',
      mime: ''
    });
    setSelectedFile(null);
    setFileName('');
    alert('Модель успешно загружена!');
  };
  // Тема
  document.documentElement.classList.toggle('dark', darkMode);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Навигационная панель */}
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

    {/* Табы навигации */}
    <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} results={results} />

    {/* Контент вкладок */}
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Вкладка: Модели (каталог) */}
        {activeTab === 'models' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Каталог моделей</h2>

            {/* Поиск */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium mb-1">Поиск модели</label>
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по названию, описанию или тегам..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Фильтр по типу задачи</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onChange={(e) => setTaskType(e.target.value)}
                value={taskType}
              >
                <option value="">Все</option>
                <option value="classification">Классификация</option>
                <option value="segmentation">Сегментация</option>
              </select>
            </div>

            <div className="space-y-4">
              {filteredModels.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">Модели не найдены.</p>
              ) : (
                filteredModels.map(model => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    isSelected={selectedModels.some(m => m.id === model.id)}
                    onSelect={() => {
                      if (selectedModels.some(m => m.id === model.id)) {
                        setSelectedModels(selectedModels.filter(m => m.id !== model.id));
                      } else {
                        setSelectedModels([...selectedModels, model]);
                      }
                    }}
                  />
                ))
              )}
            </div>
          </div>
        )}
        {/* Вкладка: Загрузка изображения */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Загрузка изображения</h2>
            {/* Image Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center dark:border-gray-600">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => setUploadedImage(event.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer block">
                <svg className="w-12 h-12 text-gray-400 mb-2 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm text-gray-500 dark:text-gray-400">Перетащите или загрузите изображение</span>
                <p className="text-xs text-gray-400 mt-1">Поддерживаемые форматы: PNG, JPG</p>
              </label>
            </div>

            {uploadedImage && (
              <>
                <div className="mt-6">
                  <h2 className="text-xl font-bold mb-3">Выберите тип задачи</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['classification', 'segmentation'].map(type => (
                      <button
                        key={type}
                        onClick={() => setTaskType(type)}
                        className={`py-3 px-4 rounded-lg border text-center ${
                          taskType === type
                            ? 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-300'
                            : 'border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h2 className="text-xl font-bold mb-3">Выберите модели для анализа</h2>
                  {/* Поиск */}
                  <div className="mb-6">
                    <label htmlFor="search" className="block text-sm font-medium mb-1">Поиск модели</label>
                    <input
                      id="search"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Поиск по названию, описанию или тегам..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div className="space-y-4">
                    {filteredModels.length === 0 ? (
                      <p className="text-center text-gray-500 dark:text-gray-400">Модели не найдены.</p>
                    ) : (
                      filteredModels.map(model => (
                        <ModelCard
                          key={model.id}
                          model={model}
                          isSelected={selectedModels.some(m => m.id === model.id)}
                          onSelect={() => {
                            if (selectedModels.some(m => m.id === model.id)) {
                              setSelectedModels(selectedModels.filter(m => m.id !== model.id));
                            } else {
                              setSelectedModels([...selectedModels, model]);
                            }
                          }}
                        />
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={runModels}
                    disabled={!taskType || selectedModels.length === 0}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      !taskType || selectedModels.length === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                        : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
                    }`}
                  >
                    Запустить модели
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Вкладка: Результаты */}
        {activeTab === 'evaluate' && uploadedImage && (
          <div className="space-y-6">

            {/* Результаты анализа */}
            {results.length > 0 && (
              <ModelResults results={results} uploadedImage={uploadedImage} taskType={taskType} />
            )}
          </div>
        )}

        {/* Вкладка: Разработчики */}
        {activeTab === 'developer' && (
          <div className="space-y-6">
            {/* Подвкладки: Загрузить модель / Фидбэк */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setDeveloperSubTab('upload')}
                className={`py-2 px-4 font-medium ${
                  developerSubTab === 'upload'
                    ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Загрузить модель
              </button>
              <button
                onClick={() => setDeveloperSubTab('feedback')}
                className={`py-2 px-4 font-medium ${
                  developerSubTab === 'feedback'
                    ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Фидбэк по моделям
              </button>
            </div>

            {/* Подвкладка: Загрузить модель */}
            {developerSubTab === 'upload' && (
              <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
                <h3 className="text-lg font-semibold mb-4">Добавить новую модель</h3>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="block text-sm font-medium mb-1">Название модели *</label>
                    <input
                      type="text"
                      name="name"
                      value={newModelData.name}
                      onChange={handleInputChange}
                      placeholder="Введите название модели"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Тип задачи *</label>
                    <select
                      name="taskType"
                      value={newModelData.taskType}
                      onChange={(e) => {
                        const selectedTaskType = e.target.value;
                        setNewModelData(prev => ({ ...prev, taskType: selectedTaskType }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="">Выберите тип задачи</option>
                      {Array.from(new Set(availableModels.map(m => m.taskType))).map(type => (
                        <option key={type} value={type} selected={type === 'classification'}>
                          {type === 'classification' ? 'Классификация' : 'Сегментация'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Описание модели</label>
                    <textarea
                      name="description"
                      value={newModelData.description}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Введите описание модели"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Архитектура</label>
                      <input
                        type="text"
                        name="architecture"
                        value={newModelData.architecture}
                        onChange={handleInputChange}
                        placeholder="например: ResNet-50"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Тип файла</label>
                      <input
                        type="text"
                        name="mime"
                        value={newModelData.mime}
                        onChange={handleInputChange}
                        placeholder="например: png"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Размер входного изображения</label>
                      <input
                        type="text"
                        name="inputSize"
                        value={newModelData.inputSize}
                        onChange={handleInputChange}
                        placeholder="например: 224x224"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Фреймворк</label>
                      <input
                        type="text"
                        name="framework"
                        value={newModelData.framework}
                        onChange={handleInputChange}
                        placeholder="например: TensorFlow"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Время инференса</label>
                      <input
                        type="text"
                        name="inferenceTime"
                        value={newModelData.inferenceTime}
                        onChange={handleInputChange}
                        placeholder="например: 38ms"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Точность</label>
                      <input
                        type="text"
                        name="accuracy"
                        value={newModelData.accuracy}
                        onChange={handleInputChange}
                        placeholder="например: 92%"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Датасет*</label>
                      <input
                        type="text"
                        name="dataset"
                        value={newModelData.dataset}
                        onChange={handleInputChange}
                        placeholder="например: Датасет CIFAR-10"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Лицензия*</label>
                      <input
                        type="text"
                        name="license"
                        value={newModelData.license}
                        onChange={handleInputChange}
                        placeholder="например: MIT"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Размер модели*</label>
                      <input
                        type="text"
                        name="size"
                        value={newModelData.size}
                        onChange={handleInputChange}
                        placeholder="например: 200MB"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Поддерживаемые девайсы*</label>
                      <input
                        type="text"
                        name="supportedDevices"
                        value={newModelData.supportedDevices}
                        onChange={handleInputChange}
                        placeholder="например: CPU, GPU, TPU"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Теги*</label>
                      <input
                        type="text"
                        name="tags"
                        value={newModelData.tags}
                        onChange={handleInputChange}
                        placeholder="например: животные, медицина, машины"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Версия*</label>
                      <input
                        type="text"
                        name="version"
                        value={newModelData.version}
                        onChange={handleInputChange}
                        placeholder="например: 1.0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Источник*</label>
                      <input
                        type="text"
                        name="sourceCode"
                        value={newModelData.sourceCode}
                        onChange={handleInputChange}
                        placeholder="например: https://github.com/tensorflow/models"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Документация*</label>
                      <input
                        type="text"
                        name="documentation"
                        value={newModelData.documentation}
                        onChange={handleInputChange}
                        placeholder="например: https://www.tensorflow.org/api_docs/python/tf/keras/Model"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Загрузка файла модели */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Файл модели (*.onnx или *.h5)</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-gray-300 dark:border-gray-600 hover:border-blue-400 transition-colors cursor-pointer dark:hover:border-blue-500">
                      <div className="space-y-1 text-center">
                        {fileName ? (
                          <p className="text-sm text-green-600 dark:text-green-400">{fileName}</p>
                        ) : (
                          <>
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-10v8a2 2 0 01-2 2H12a2 2 0 01-2-2v-8m20-10l-6 6m0 0l-6-6m6 6V4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                              <span>Перетащите сюда или нажмите для выбора файла</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Поддерживаемые форматы: .onnx, .h5</p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        accept=".onnx,.h5"
                        onChange={handleFileChange}
                        className="hidden"
                        id="model-upload"
                      />
                    </div>
                    {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}
                  </div>

                  {/* Кнопка отправки */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!newModelData.name || !newModelData.taskType || !selectedFile}
                      className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors ${
                        !newModelData.name || !newModelData.taskType || !selectedFile
                          ? 'opacity-60 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      Загрузить модель
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Подвкладка: Фидбэк по моделям */}
            {developerSubTab === 'feedback' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Фидбэк по вашим моделям</h3>
                {developerModels.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">Вы ещё не загрузили ни одной модели.</p>
                ) : (
                  developerModels.map(model => (
                    <div key={model.id} className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
                      <h4 className="font-medium text-lg">{model.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{model.description}</p>
                      {model.feedbacks.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400">Нет отзывов для этой модели.</p>
                      ) : (
                        model.feedbacks.map(feedback => (
                          <div key={feedback.id} className="border-t pt-4 dark:border-gray-700">
                            <div className="flex items-center space-x-2 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-5 h-5 ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <p className="mb-2">{feedback.comment}</p>
                            {feedback.image && (
                              <div className="relative inline-block border border-gray-300 rounded dark:border-gray-600">
                                <img src={feedback.image} alt="Пример ошибки" className="w-40 h-auto" />
                                <div
                                  className="absolute border-2 border-red-500 bg-red-500 bg-opacity-30"
                                  style={{
                                    left: `${feedback.errorRegion?.x ?? 0}px`,
                                    top: `${feedback.errorRegion?.y ?? 0}px`,
                                    width: `${feedback.errorRegion?.width ?? 0}px`,
                                    height: `${feedback.errorRegion?.height ?? 0}px`
                                  }}
                                >
                                  <div className="absolute -top-5 left-0 bg-red-500 text-white text-xs px-2 rounded">
                                    Ошибка
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Вкладка: Оценка модели */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Оценка модели</h2>

            {/* Выбор модели */}
            <div>
              <label className="block text-sm font-medium mb-2">Выберите модель</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onChange={(e) => {
                  const selected = developerModels.find(m => m.id === Number(e.target.value));
                  setSelectedFeedbackModel(selected || null);
                }}
                value={selectedFeedbackModel?.id || ''}
              >
                <option value="">-- Выберите модель --</option>
                {developerModels.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name} ({model.taskType})
                  </option>
                ))}
              </select>
            </div>

            {/* Показываем FeedbackTab только если выбрана модель */}
            {selectedFeedbackModel && (
              <FeedbackTab
                uploadedImage={uploadedImage}
                feedbacks={selectedFeedbackModel.feedbacks}
                result={
                  (results.find(r => r.modelId === selectedFeedbackModel.id)?.result as ModelResult) || {
                    class: 'Other',
                    confidence: '0.5',
                  }
                }
                taskType={selectedFeedbackModel.taskType}
              />
            )}
          </div>
        )}
      </div>
    </main>

      {/* Футер */}
      <Footer />
    </div>
  );
};
export default Home;
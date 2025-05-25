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

import { Model, DeveloperModel } from '@/types/model.types';
import { NewModelData } from '@/types/new-model.types';

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

  // Генерация mock-результатов
  const generateMockResult = (type: string) => {
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
        inputSize: '224x224'
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
        inputSize: '224x224'
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
        inputSize: '512x512'
      }
    }
  ];

  // Загруженные модели от разработчика
  const [developerModels, setDeveloperModels] = useState<DeveloperModel[]>([
    {
      id: 101,
      name: 'Custom Horse Classifier',
      description: 'Разработанная пользователем модель для классификации лошадей',
      taskType: 'classification',
      architecture: 'MobileNet-V2',
      accuracy: '88%',
      inferenceTime: '25ms',
      inputSize: '224x224',
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
          image: null
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
    inputSize: ''
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

    const newModel: DeveloperModel = {
      id: Date.now(),
      ...newModelData,
      feedbacks: [],
      file: fileName
    };

    setDeveloperModels([...developerModels, newModel]);
    setNewModelData({
      name: '',
      description: '',
      taskType: '',
      architecture: '',
      accuracy: '',
      inferenceTime: '',
      inputSize: ''
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
                  <div className="space-y-4">
                    {availableModels
                      .filter(model => model.taskType === taskType || taskType === '')
                      .map(model => (
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
                      ))}
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
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Оценка */}
              <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
                <h3 className="text-lg font-semibold mb-4">Ваша оценка</h3>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Оценка модели</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => {}}
                        className="focus:outline-none"
                      >
                        <svg
                          className={`w-8 h-8 ${5 >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="comment" className="block text-sm font-medium mb-2">
                    Комментарий
                  </label>
                  <textarea
                    id="comment"
                    rows={4}
                    placeholder="Введите комментарий..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  ></textarea>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => alert('Спасибо за вашу оценку!')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Отправить оценку
                  </button>
                </div>
              </div>

              {/* Выделение ошибки на изображении */}
              <div className="lg:col-span-2 bg-gray-100 p-4 rounded-lg dark:bg-gray-700 relative">
                <h3 className="text-lg font-semibold mb-4">Выделите область ошибки на изображении</h3>
                <div className="relative bg-white rounded shadow-inner">
                  {uploadedImage ? (
                    <img src={uploadedImage} alt="Для отметки ошибок" className="w-full h-auto max-h-96" />
                  ) : (
                    <div className="w-full h-64 flex items-center justify-center text-gray-400 dark:text-gray-500">
                      Изображение не загружено
                    </div>
                  )}
                  {/* Пример выделенной области ошибки */}
                  <div
                    className="absolute border-2 border-red-500 p-1 bg-red-500 bg-opacity-30"
                    style={{ left: '30%', top: '40%', width: '100px', height: '80px' }}
                  >
                    <div className="absolute -top-5 left-0 bg-red-500 text-white text-xs px-2 rounded">
                      Обнаружена ошибка
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
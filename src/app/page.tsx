"use client"

// import Image from "next/image";
import { useState } from 'react';

// Типы для модели
interface ModelParams {
  architecture: string;
  accuracy: string;
  inferenceTime: string;
  inputSize: string;
}

interface Model {
  id: number;
  name: string;
  description: string;
  taskType: string;
  parameters?: ModelParams;
}

// Типы для разработчика
interface Feedback {
  id: number;
  rating: number;
  comment: string;
  image: string | null;
  errorRegion?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface DeveloperModel {
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

// Типы формы добавления модели
interface NewModelData {
  name: string;
  description: string;
  taskType: string;
  architecture: string;
  accuracy: string;
  inferenceTime: string;
  inputSize: string;
}

const Home: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [developerSubTab, setDeveloperSubTab] = useState<string>('upload');

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
          comment: 'Хорошая точность, но иногда путает молодых жеребят с ослами.',
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

  // Темизация
  document.documentElement.classList.toggle('dark', darkMode);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Навигационная панель */}
      <header className="bg-white shadow-sm dark:bg-gray-800 dark:text-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h1 className="text-xl font-bold">AI Eval</h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-3-4a1 1 0 00-1-1H3a1 1 0 000 2h1a1 1 0 001-1zm1.414 4L2.98 9.48a1 1 0 000-1.41l.707-.707a1 1 0 00-1.414-1.414L0 7.48v1.04l2.07 2.07a1 1 0 001.414-1.414zm12 0l2.07-2.07a1 1 0 000-1.414l-.707-.707a1 1 0 00-1.414 1.414L17 7.48v1.04l-1.414 1.414a1 1 0 101.414 1.414zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.414 14.586a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm12 0a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 00-1 1v1a1 1 0 102 0V11a1 1 0 00-1-1zm11 0a1 1 0 00-1 1v1a1 1 0 102 0V11a1 1 0 00-1-1z" clipRule="evenodd" fillRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>
    </header>

    {/* Табы навигации */}
    <nav className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-6">
            <button
              onClick={() => setActiveTab('upload')}
              className={`inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Загрузка
            </button>
          </li>
          <li className="mr-6">
            <button
              onClick={() => setActiveTab('developer')}
              className={`inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'developer'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Разработчики
            </button>
          </li>
        </ul>
      </div>
    </nav>

    {/* Контент страницы */}
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Вкладка: Загрузка изображения */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Загрузка изображения</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center dark:border-gray-600">
              <input type="file" accept="image/*" id="image-upload" className="hidden" />
              <label htmlFor="image-upload" className="cursor-pointer block">
                <svg className="w-12 h-12 text-gray-400 mb-2 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm text-gray-500 dark:text-gray-400">Перетащите или загрузите изображение</span>
                <p className="text-xs text-gray-400 mt-1">Поддерживаемые форматы: PNG, JPG</p>
              </label>
            </div>
            <p className="text-center text-green-600 dark:text-green-400 mt-4">✅ Изображение не требуется для тестирования интерфейса.</p>
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
                        <option key={type} value={type}>
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
      </div>
    </main>

      {/* Футер */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>© 2025 AI Eval. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
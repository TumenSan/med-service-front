// import { useState } from 'react';
import { Model } from '@/types/model.types';

interface ModelCardProps {
  model: Model;
  isSelected: boolean;
  onSelect: () => void;
}

const ModelCard: React.FC<ModelCardProps> = ({ model, isSelected, onSelect }) => {
  const { parameters } = model;

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md border transition-transform ${isSelected ? 'border-blue-500 scale-105' : 'border-gray-200 hover:scale-102'} dark:bg-gray-800 dark:border-gray-700`}>
      <h3 className="text-lg font-semibold">{model.name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{model.description}</p>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <p><strong>Архитектура:</strong> {parameters.architecture}</p>
        <p><strong>Точность:</strong> {parameters.accuracy}</p>
        <p><strong>Фреймворк:</strong> {parameters.framework || '-'}</p>
        <p><strong>Размер:</strong> {parameters.size || '-'}</p>
        <p><strong>Устройства:</strong> {parameters.supportedDevices?.join(', ') || '-'}</p>
        <p><strong>Лицензия:</strong> {parameters.license || '-'}</p>
        <p><strong>Дата обновления:</strong> {parameters.updatedAt || '-'}</p>
        <p><strong>Датасет:</strong> {parameters.dataset || '-'}</p>
        <p><strong>Версия:</strong> {parameters.version || '-'}</p>
        <p><strong>Автор:</strong> {parameters.author || '-'}</p>
        <p><strong>Источник:</strong> {parameters.sourceCode || '-'}</p>
        <p><strong>Документация:</strong> {parameters.documentation || '-'}</p>
      </div>

      <div className="mt-3 flex justify-between items-center">
        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full dark:bg-gray-700">
          {model.taskType === 'classification' ? 'Классификация' : 'Сегментация'}
        </span>
        <button
          onClick={onSelect}
          className={`px-3 py-1 text-sm rounded ${
            isSelected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          {isSelected ? 'Выбрана' : 'Выбрать'}
        </button>
      </div>
    </div>
  );
};

export default ModelCard;
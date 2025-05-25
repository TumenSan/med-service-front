// import { useState } from 'react';
import { Model } from '@/types/model.types';

interface ModelCardProps {
  model: Model;
  isSelected: boolean;
  onSelect: () => void;
}

const ModelCard = ({ model, isSelected, onSelect }: ModelCardProps) => {
  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-lg border cursor-pointer transition-all ${
        isSelected
          ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/30 dark:border-blue-500'
          : 'border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">{model.name}</h3>
          <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">{model.description}</p>
        </div>
        <div className="ml-2 flex-shrink-0">
          <span
            className={`inline-block w-4 h-4 rounded-full ${
              model.taskType === 'classification' ? 'bg-green-400' : 'bg-purple-400'
            }`}
          ></span>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-600 dark:text-gray-400">
        <div>
          <strong>Архитектура:</strong> {model.parameters?.architecture}
        </div>
        <div>
          <strong>Точность:</strong> {model.parameters?.accuracy}
        </div>
        <div>
          <strong>Время:</strong> {model.parameters?.inferenceTime}
        </div>
        <div>
          <strong>Размер:</strong> {model.parameters?.inputSize}
        </div>
      </div>
    </div>
  );
};

export default ModelCard;
'use client';

import { useCallback, useState, useRef, ChangeEvent } from 'react';
import styles from './UploadPanel.module.scss';

interface ModelOption {
  id: string;
  name: string;
}

export const UploadPanel = () => {
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const modelOptions: ModelOption[] = [
    { id: 'lung_seg_v2', name: 'Сегментация лёгких v2' },
    { id: 'pneumonia_class', name: 'Классификация пневмонии' },
  ];

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }
  }, []);

  const handleFileInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, []);

  const handleFiles = (files: FileList) => {
    // Обработка загруженных файлов
    console.log('Загружены файлы:', files);
    // Здесь можно добавить проверку на DICOM формат
  };

  const handleRun = useCallback(() => {
    if (!selectedModel) {
      alert('Пожалуйста, выберите модель');
      return;
    }
    console.log('Запуск модели:', selectedModel);
    // Здесь будет логика запуска обработки
  }, [selectedModel]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>Загрузка DICOM</h3>
      
      {/* Область перетаскивания */}
      <div
        className={`${styles.dropzone} ${isDragging ? styles.dragging : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          className={styles.fileInput}
          accept=".dcm,image/dicom"
          multiple
          // directory=""
          // webkitdirectory=""
        />
        <div className={styles.dropzoneContent}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"/>
          </svg>
          <p>Перетащите DICOM-файлы или папку сюда</p>
          <p className={styles.orText}>или</p>
          <button className={styles.browseButton}>Выбрать файлы</button>
        </div>
      </div>

      {/* Выбор модели */}
      <div className={styles.modelSelection}>
        <label htmlFor="model-select" className={styles.label}>
          Выберите модель:
        </label>
        <select
          id="model-select"
          className={styles.select}
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          <option value="">-- Выберите модель --</option>
          {modelOptions.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>

      {/* Кнопка запуска */}
      <button
        className={styles.runButton}
        onClick={handleRun}
        disabled={!selectedModel}
      >
        Запустить
      </button>
    </div>
  );
};
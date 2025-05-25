import React, { useState, useRef } from 'react';

import { Feedback } from '@/types/feedback.types';

interface FeedbackRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ModelFeedbackProps {
  uploadedImage: string | null;
  feedbacks: Feedback[];
}

const FeedbackTab: React.FC<ModelFeedbackProps> = ({ uploadedImage, feedbacks }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [errorRegion, setErrorRegion] = useState<FeedbackRegion | null>(null);

  // Для рисования выделения
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
  const [selectionBox, setSelectionBox] = useState<DOMRect | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageContainerRef.current || !uploadedImage) return;

    const containerRect = imageContainerRef.current.getBoundingClientRect();
    const startX = e.clientX - containerRect.left;
    const startY = e.clientY - containerRect.top;

    setSelectionStart({ x: startX, y: startY });
    setIsSelecting(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting || !selectionStart || !imageContainerRef.current) return;

    const containerRect = imageContainerRef.current.getBoundingClientRect();
    const currentX = e.clientX - containerRect.left;
    const currentY = e.clientY - containerRect.top;

    const width = currentX - selectionStart.x;
    const height = currentY - selectionStart.y;

    setSelectionBox(
      new DOMRect(selectionStart.x, selectionStart.y, width, height)
    );
  };

  const handleMouseUp = () => {
    if (!selectionStart || !selectionBox) return;

    setErrorRegion({
      x: selectionBox.x,
      y: selectionBox.y,
      width: selectionBox.width,
      height: selectionBox.height,
    });

    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionBox(null);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Пожалуйста, поставьте оценку.');
      return;
    }

    // Здесь можно отправить отзыв + errorRegion на сервер
    console.log('Отправлено:', { rating, comment, errorRegion });

    alert('Спасибо за вашу оценку и комментарий!');
  };

  return (
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
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                  type="button"
                >
                  <svg
                    className={`w-8 h-8 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
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
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Введите комментарий..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              type="button"
            >
              Отправить оценку
            </button>
          </div>
        </div>

        {/* Выделение ошибки на изображении */}
        <div
          className="lg:col-span-2 bg-gray-100 p-4 rounded-lg dark:bg-gray-700 relative"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <h3 className="text-lg font-semibold mb-4">Выделите область ошибки на изображении</h3>
          <div
            ref={imageContainerRef}
            className="relative bg-white rounded shadow-inner"
          >
            {uploadedImage ? (
              <img
                src={uploadedImage}
                alt="Для отметки ошибок"
                className="w-full h-auto max-h-96"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center text-gray-400 dark:text-gray-500">
                Изображение не загружено
              </div>
            )}

            {/* Выделенная область */}
            {selectionBox && isSelecting && (
              <div
                className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20"
                style={{
                  left: `${selectionBox.x}px`,
                  top: `${selectionBox.y}px`,
                  width: `${selectionBox.width}px`,
                  height: `${selectionBox.height}px`,
                }}
              />
            )}

            {/* Сохранённая область ошибки */}
            {errorRegion && (
              <div
                className="absolute border-2 border-red-500 bg-red-500 bg-opacity-30"
                style={{
                  left: `${errorRegion.x}px`,
                  top: `${errorRegion.y}px`,
                  width: `${errorRegion.width}px`,
                  height: `${errorRegion.height}px`,
                }}
              >
                <div className="absolute -top-5 left-0 bg-red-500 text-white text-xs px-2 rounded">
                  Обнаружена ошибка
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Список отзывов */}
      {feedbacks.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Предыдущие отзывы</h3>
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div key={feedback.id} className="bg-white p-4 rounded-lg shadow-md dark:bg-gray-800">
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
                        height: `${feedback.errorRegion?.height ?? 0}px`,
                      }}
                    >
                      <div className="absolute -top-5 left-0 bg-red-500 text-white text-xs px-2 rounded">
                        Ошибка
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackTab;
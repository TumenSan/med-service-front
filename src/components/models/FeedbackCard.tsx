import RatingStars from './RatingStars';
import { Feedback } from '@/types/feedback.types';

interface FeedbackCardProps {
  feedback: Feedback;
}

const FeedbackCard = ({ feedback }: FeedbackCardProps) => {
  return (
    <div className="border-t pt-4 dark:border-gray-700">
      <div className="flex items-center space-x-2 mb-2">
        <RatingStars rating={feedback.rating} />
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
  );
};

export default FeedbackCard;
// import FeedbackCard from './FeedbackCard';
import { Developer } from '@/types/developer.types';
import FeedbackCard from './FeedbackCard';

interface DeveloperCardProps {
  model: Developer;
}

const DeveloperModelCard = ({ model }: DeveloperCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
      <h4 className="font-medium text-lg">{model.name}</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{model.description}</p>
      {model.feedbacks.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Нет отзывов для этой модели.</p>
      ) : (
        model.feedbacks.map((feedback) => (
          <FeedbackCard key={feedback.id} feedback={feedback} />
        ))
      )}
    </div>
  );
};

export default DeveloperModelCard;
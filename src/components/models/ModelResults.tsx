// import Image from 'next/image';
import { Result } from '@/types/model.types';

interface ModelResultsProps {
  results: Result[];
  uploadedImage: string | null;
  taskType: string;
}

const ModelResults = ({ results, uploadedImage, taskType }: ModelResultsProps) => {
  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-xl font-bold">Результаты анализа</h3>
      <div className="relative bg-gray-100 rounded-lg overflow-hidden dark:bg-gray-800">
        {uploadedImage && (
          <img
            src={uploadedImage}
            alt="Uploaded"
            className="w-full max-h-96 object-contain mx-auto"
          />
        )}
        {taskType === 'segmentation' && results.length > 0 && (
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-black bg-opacity-40 flex items-center justify-center">
            <img
              src={results[0].result.maskUrl || ''}
              alt="Segmentation Mask"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((result, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800"
          >
            <h3 className="text-lg font-semibold mb-4">{result.modelName}</h3>
            {taskType === 'classification' && (
              <div className="space-y-2">
                <p>
                  Класс: <span className="font-medium">{result.result.class}</span>
                </p>
                <p>
                  Уверенность: <span className="font-medium">{result.result.confidence}</span>
                </p>
              </div>
            )}
            {taskType === 'segmentation' && (
              <div className="mt-4">
                <img
                  src={result.result.maskUrl || ''}
                  alt="Segmentation Mask"
                  className="w-full h-48 object-cover rounded"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelResults;
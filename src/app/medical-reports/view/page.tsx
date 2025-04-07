import { TraditionalMedicalReport, UploadPanel } from '@/components/templates';
import Image from 'next/image';
import imageData from '@/app/images/ImageData1.png';

export default function ReportViewPage() {
  return (
    <main className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-row gap-12">
          {/* Левая панель (загрузка файлов) */}
          <div className="w-80 flex-shrink-0">
            <UploadPanel />
          </div>

          <div className="flex items-center justify-center w-100 mx-4 border-l border-r border-gray-200">
            <Image
              src={imageData}
              alt="Изображение исследования"
              width={700}
              height={900}
              className="object-contain max-h-[1000px]"
              priority
            />
          </div>

          {/* Правая часть (мед. заключение) */}
          <div className="flex-1">
            <TraditionalMedicalReport />
          </div>
        </div>
      </div>
    </main>
  );
}
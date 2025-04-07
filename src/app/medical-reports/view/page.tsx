import { TraditionalMedicalReport, UploadPanel } from '@/components/templates';

export default function ReportViewPage() {
  return (
    <main className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-row gap-6">
          {/* Левая панель (загрузка файлов) */}
          <div className="w-80 flex-shrink-0">
            <UploadPanel />
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
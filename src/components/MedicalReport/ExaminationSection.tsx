import React from 'react';

interface ExaminationData {
  rcc: string;
  lcc: string;
  lmo: string;
  quadrants: {
    right: string[];
    left: string[];
  };
  markers: string[];
}

export const ExaminationSection = ({ data }: { data: ExaminationData }) => (
  <section className="mb-8">
    <h2 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-2">Обследование</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
      <div>
        <p><span className="font-medium">RCC:</span> {data.rcc}</p>
        <p><span className="font-medium">LCC:</span> {data.lcc}</p>
        <p><span className="font-medium">LMO:</span> {data.lmo}</p>
      </div>
      <div>
        <p className="font-medium">Квадранты:</p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="font-medium">Правая:</p>
            <ul className="list-disc pl-5">
              {data.quadrants.right.map((item, i) => (
                <li key={`r-quad-${i}`}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium">Левая:</p>
            <ul className="list-disc pl-5">
              {data.quadrants.left.map((item, i) => (
                <li key={`l-quad-${i}`}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <div className="mt-4">
      <p className="font-medium mb-2">Маркеры:</p>
      <div className="grid grid-cols-4 gap-2">
        {data.markers.map((marker, i) => (
          <span key={`marker-${i}`} className="border border-gray-400 p-1 text-center font-bold">
            {marker}
          </span>
        ))}
      </div>
    </div>
  </section>
);
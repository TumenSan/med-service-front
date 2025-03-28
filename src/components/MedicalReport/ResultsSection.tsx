import React from 'react';

interface ResultsData {
  findings: {
    title: string;
    items: string[];
  }[];
  conclusion: string;
}

export const ResultsSection = ({ data }: { data: ResultsData }) => (
  <section>
    <h2 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-2">Результаты исследования</h2>
    
    {data.findings.map((finding, index) => (
      <div key={`finding-${index}`} className="mb-4">
        <p className="font-medium">{finding.title}</p>
        <ul className="list-disc pl-8 mt-2 space-y-1">
          {finding.items.map((item, i) => (
            <li key={`item-${index}-${i}`}>{item}</li>
          ))}
        </ul>
      </div>
    ))}
    
    <div className="mt-6 p-4 bg-gray-100 rounded">
      <p className="font-medium">Заключение:</p>
      <p>{data.conclusion}</p>
    </div>
  </section>
);
import React from 'react';

interface PatientData {
  fullName: string;
  association?: string;
  birthDate: string;
  studyDate: string;
  cardNumber: string;
}

export const PatientSection = ({ data }: { data: PatientData }) => (
  <section className="mb-8">
    <h2 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-2">Пациент</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p><span className="font-medium">Ф.И.О.:</span> {data.fullName}</p>
        {data.association && <p><span className="font-medium">Ассоциация:</span> {data.association}</p>}
      </div>
      <div>
        <p><span className="font-medium">Дата рождения:</span> {data.birthDate}</p>
        <p><span className="font-medium">Дата исследования:</span> {data.studyDate}</p>
        <p><span className="font-medium">Номер карты:</span> {data.cardNumber}</p>
      </div>
    </div>
  </section>
);
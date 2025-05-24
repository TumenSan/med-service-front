'use client';

import React, { useEffect, useState } from 'react';

interface PatientData {
  fullName: string;
  association?: string;
  birthDate: string;
  studyDate: string;
  cardNumber: string;
}

export const PatientSection = ({ patientId }: { patientId: number }) => {
  const [data, setData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/patients/1`);  // const response = await fetch(`http://localhost:8080/api/patients/${patientId}`);
        if (!response.ok) {
          throw new Error('Ошибка при загрузке данных пациента');
        }
        const patientData = await response.json();
        setData(patientData);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };
    fetchPatientData();
  }, [patientId]);

  if (loading) return <div>Загрузка данных пациента...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!data) return <div>Данные пациента не найдены</div>;

  return (
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
};
import React from 'react';
import { PatientSection, ExaminationSection, ResultsSection } from '@/components/MedicalReport';

interface MedicalData {
  patient: {
    fullName: string;
    association?: string;
    birthDate: string;
    studyDate: string;
    cardNumber: string;
  };
  examination: {
    rcc: string;
    lcc: string;
    lmo: string;
    quadrants: {
      right: string[];
      left: string[];
    };
    markers: string[];
  };
  results: {
    findings: {
      title: string;
      items: string[];
    }[];
    conclusion: string;
  };
}

export const TraditionalMedicalReport = () => {
  const data: MedicalData = {
    patient: {
      fullName: "Иванова Мария Петровна",
      association: "Ассоциация",
      birthDate: "15.04.1975",
      studyDate: "7 октября 2020",
      cardNumber: "0814M1-2664-M47-M6-0045B01005"
    },
    examination: {
      rcc: "RCC данные",
      lcc: "LCC данные",
      lmo: "LMO данные",
      quadrants: {
        right: ["R-квадрант 1", "R-квадрант 2"],
        left: ["L-квадрант 1", "L-квадрант 2"]
      },
      markers: ["ВН", "ВВ", "ВВ", "ВН", "НН", "НВ", "НВ", "НН"]
    },
    results: {
      findings: [
        {
          title: "Прямая сторона (К):",
          items: [
            "Структура монополированная до ССР: В",
            "Определение и количество продуктов (небесного жидкости) пилотности",
            "Предприятие для монополированной до ССР: В"
          ]
        }
      ],
      conclusion: "Необходимо проводиться добропорядоченным диагностическим этапам."
    }
  };

  return (
    <div className="medical-report font-sans max-w-4xl mx-auto p-6 bg-white shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Медицинское заключение</h1>
      
      <PatientSection data={data.patient} />
      <ExaminationSection data={data.examination} />
      <ResultsSection data={data.results} />
      
      <div className="mt-8 pt-4 border-t border-gray-300">
        <p className="text-sm text-gray-600">Дата формирования: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};
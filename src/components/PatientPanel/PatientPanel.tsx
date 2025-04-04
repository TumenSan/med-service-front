'use client';

import React from 'react';
import styles from './PatientPanel.module.scss';

const PatientPanel = () => {
  return (
    <div className={styles['patient-info-wrapper']}>
      <div className={styles['ym-hide-content']}>
        <div className={styles['patient-info-header']}>
          <span>Пациент</span>
          <ul>
          </ul>
        </div>
      </div>
      <div className={styles['patient-info-footer']}>
      </div>
    </div>
  );
};

export default PatientPanel;
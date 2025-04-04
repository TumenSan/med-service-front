'use client'

import { FC, MouseEvent, ReactNode, useCallback } from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'transparent' | 'light' | 'dark' | 'black' | 'warning';
  size?: 'big' | 'medium' | 'small';
  wide?: boolean;
  title: string | ReactNode;
  className?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  isDisabled?: boolean;
  isLoading?: boolean;
}

const Button: FC<ButtonProps> = ({
  type = 'button',
  variant = 'primary',
  size = 'medium',
  wide = false,
  title,
  className,
  icon,
  iconPosition = 'left',
  onClick,
  isDisabled = false,
  isLoading = false
}) => {
  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled && !isLoading && onClick) {
      onClick(event);
    }
  }, [isDisabled, isLoading, onClick]);

  const getVariantClass = useCallback(() => {
    switch (variant) {
      case 'primary':
        return styles.button_primary;
      case 'secondary':
        return styles.button_secondary;
      case 'transparent':
        return styles.button_transparent;
      case 'light':
        return styles.button_light;
      case 'dark':
        return styles.button_dark;
      case 'black':
        return styles.button_black;
      case 'warning':
        return styles.button_warning;
      default:
        return '';
    }
  }, [variant]);

  const getSizeClass = useCallback(() => {
    switch (size) {
      case 'big':
        return styles.button_big;
      case 'medium':
        return styles.button_medium;
      case 'small':
        return styles.button_small;
      default:
        return '';
    }
  }, [size]);

  return (
    <button
      disabled={isDisabled || isLoading}
      type={type}
      className={
        `${styles.button} ` +
        `${getVariantClass()} ` +
        `${getSizeClass()} ` +
        `${wide ? styles.button_wide : ''} ` +
        `${className}`
      }
      onClick={handleClick} // Используем обернутый обработчик
    >
      {isLoading ? (
        <div className={styles.loader} /> // Добавьте стили для лоадера
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <div className={`${styles.icon} ${styles.icon_left}`}>{icon}</div>
          )}

          <span className={styles.title}>{title}</span>

          {icon && iconPosition === 'right' && (
            <div className={`${styles.icon} ${styles.icon_right}`}>{icon}</div>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
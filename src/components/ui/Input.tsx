import React, { forwardRef } from 'react';
import { X } from 'lucide-react';
import { ICON_SIZE } from '../../utils/constants';
import styles from './Input.module.css';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  onClear?: () => void;
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  leftIcon,
  onClear,
  variant = 'primary',
  size = 'md',
  className = '',
  value,
  ...props
}, ref) => {
  return (
    <div className={`${styles.wrapper} ${className} ${styles[`size-${size}`]}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={`${styles.inputContainer} ${error ? styles.hasError : ''} ${styles[variant]}`}>
        {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
        <input 
          ref={ref}
          className={styles.input} 
          value={value}
          {...props} 
        />
        {onClear && value && (
          <button type="button" className={styles.clearBtn} onClick={onClear}>
            <X size={ICON_SIZE.SM} />
          </button>
        )}
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  label,
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea 
        ref={ref}
        className={`${styles.textarea} ${error ? styles.hasError : ''}`} 
        {...props} 
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
});

TextArea.displayName = 'TextArea';

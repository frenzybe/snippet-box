import React from 'react';
import { ChevronDown } from 'lucide-react';
import { ICON_SIZE } from '../../utils/constants';
import styles from './Select.module.css';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.selectContainer}>
        <select className={styles.select} {...props}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={ICON_SIZE.BASE} className={styles.icon} />
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

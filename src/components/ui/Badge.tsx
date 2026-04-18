import React from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'outline' | 'success';
  className?: string;
  onClick?: () => void;
  onRemove?: (e: React.MouseEvent) => void;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
  onClick,
  onRemove
}) => {
  const combinedClassName = `
    ${styles.badge} 
    ${styles[variant]} 
    ${onClick ? styles.clickable : ''} 
    ${className}
  `.trim();

  return (
    <span className={combinedClassName} onClick={onClick}>
      <span className={styles.content}>{children}</span>
      {onRemove && (
        <button 
          className={styles.removeBtn} 
          onClick={(e) => {
            e.stopPropagation();
            onRemove(e);
          }}
        >
          ×
        </button>
      )}
    </span>
  );
};

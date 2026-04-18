import React from 'react';
import styles from './IconButton.module.css';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: 'ghost' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'ghost',
  size = 'md',
  active,
  className = '',
  ...props
}) => {
  const combinedClassName = `
    ${styles.iconButton} 
    ${styles[variant]} 
    ${styles[size]} 
    ${active ? styles.active : ''} 
    ${className}
  `.trim();

  return (
    <button className={combinedClassName} {...props}>
      {icon}
    </button>
  );
};

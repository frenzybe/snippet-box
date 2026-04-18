import React from 'react';
import { Loader2 } from 'lucide-react';
import styles from './Loading.module.css';

interface LoadingProps {
  fullScreen?: boolean;
  text?: string;
  size?: number;
}

export const LoadingSpinner: React.FC<LoadingProps> = ({ 
  fullScreen = false, 
  text,
  size = 24 
}) => {
  const content = (
    <div className={styles.spinnerContainer}>
      <Loader2 className={styles.spinner} size={size} />
      {text && <span className={styles.text}>{text}</span>}
    </div>
  );

  if (fullScreen) {
    return <div className={styles.fullScreen}>{content}</div>;
  }

  return content;
};

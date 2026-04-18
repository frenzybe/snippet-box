import React, { useCallback, useEffect, useState } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';
import styles from './ResizeHandle.module.css';

interface ResizeHandleProps {
  minWidth?: number;
  maxWidth?: number;
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({ 
  minWidth = 200, 
  maxWidth = 500 
}) => {
  const [isResizing, setIsResizing] = useState(false);

  const setSidebarWidth = useSettingsStore(state => state.setSidebarWidth);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth);
      }
    }
  }, [isResizing, minWidth, maxWidth, setSidebarWidth]);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <div 
      className={`${styles.handle} ${isResizing ? styles.active : ''}`}
      onMouseDown={startResizing}
    >
      <div className={styles.line} />
    </div>
  );
};

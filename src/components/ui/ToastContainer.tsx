import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useToastStore } from '../../store/useToastStore';
import { Toast } from './Toast';
import styles from './Toast.module.css';

export const ToastContainer: React.FC = () => {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className={styles.container}>
      <AnimatePresence initial={false} mode="sync">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

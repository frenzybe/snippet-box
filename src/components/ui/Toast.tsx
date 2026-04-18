import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { Toast as ToastType, useToastStore } from '../../store/useToastStore';
import { ICON_SIZE } from '../../utils/constants';
import styles from './Toast.module.css';

interface ToastProps {
  toast: ToastType;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  const removeToast = useToastStore((state) => state.removeToast);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={ICON_SIZE.MD} />;
      case 'error':
        return <AlertCircle size={ICON_SIZE.MD} />;
      default:
        return <Info size={ICON_SIZE.MD} />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`${styles.toast} ${styles[toast.type]}`}
    >
      <div className={styles.icon}>{getIcon()}</div>
      <div className={styles.message}>{toast.message}</div>
      <div className={styles.close} onClick={() => removeToast(toast.id)}>
        <X size={ICON_SIZE.SM} />
      </div>
    </motion.div>
  );
};

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ICON_SIZE } from '../utils/constants';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  compact?: boolean;
}

export function EmptyState({ icon: Icon, title, description, action, compact }: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${styles.container} ${compact ? styles.compact : ''}`}
    >
      <div className={styles.iconBg}>
        <Icon size={compact ? ICON_SIZE.LG : ICON_SIZE.XL} strokeWidth={compact ? 2 : 1.5} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </motion.div>
  );
}

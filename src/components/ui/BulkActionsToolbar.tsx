import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Star, X, CheckSquare } from 'lucide-react';
import { IconButton } from './IconButton';
import { ICON_SIZE } from '../../utils/constants';
import styles from './BulkActionsToolbar.module.css';

interface BulkActionsToolbarProps {
  count: number;
  onClear: () => void;
  onDelete: () => void;
  onFavorite: (fav: boolean) => void;
  t: any;
}

export const BulkActionsToolbar: React.FC<BulkActionsToolbarProps> = ({
  count,
  onClear,
  onDelete,
  onFavorite,
  t
}) => {
  return (
    <AnimatePresence>
      {count > 1 && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className={styles.toolbar}
        >
          <div className={styles.info}>
            <CheckSquare size={16} className={styles.icon} />
            <span className={styles.count}>{count} {t.sidebar?.selected || 'selected'}</span>
          </div>
          
          <div className={styles.divider} />
          
          <div className={styles.actions}>
            <IconButton 
              icon={<Star size={ICON_SIZE.SM} />}
              onClick={() => onFavorite(true)}
              title={t.editor?.favorite || 'Favorite'}
              variant="ghost"
              size="sm"
            />
            <IconButton 
              icon={<Trash2 size={ICON_SIZE.SM} />}
              onClick={onDelete}
              title={t.editor?.delete || 'Delete'}
              variant="ghost"
              size="sm"
              className={styles.deleteBtn}
            />
          </div>
          
          <div className={styles.divider} />
          
          <IconButton 
            icon={<X size={ICON_SIZE.SM} />}
            onClick={onClear}
            title={t.common?.cancel || 'Close'}
            variant="ghost"
            size="sm"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

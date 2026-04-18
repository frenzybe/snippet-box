import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ContextMenu.module.css';

export interface ContextMenuItemProps {
  label?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  onClick?: () => void;
  variant?: 'default' | 'danger';
  divider?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItemProps[];
  onClose: () => void;
  isOpen: boolean;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose, isOpen }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x, y });

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const menuWidth = menuRef.current.offsetWidth || 220;
      const menuHeight = menuRef.current.offsetHeight || items.length * 40;

      let finalX = x;
      let finalY = y;

      if (x + menuWidth > window.innerWidth) {
        finalX = x - menuWidth;
      }

      if (y + menuHeight > window.innerHeight) {
        finalY = y - menuHeight;
      }

      setPos({ x: finalX, y: finalY });
    }
  }, [isOpen, x, y, items.length]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div className={styles.overlay} onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
      <AnimatePresence>
        <motion.div
          ref={menuRef}
          className={styles.menu}
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, x: pos.x, y: pos.y }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 400 }}
          style={{ left: 0, top: 0, position: 'fixed' }}
        >
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {item.divider ? (
                <div className={styles.divider} />
              ) : (
                <div
                  className={`${styles.item} ${item.variant === 'danger' ? styles.danger : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    item.onClick?.();
                    onClose();
                  }}
                >
                  <div className={styles.itemContent}>
                    {item.icon && <span className={styles.icon}>{item.icon}</span>}
                    <span>{item.label}</span>
                  </div>
                  {item.shortcut && <span className={styles.shortcut}>{item.shortcut}</span>}
                </div>
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </AnimatePresence>
    </>,
    document.body
  );
};

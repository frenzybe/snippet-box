import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useLocale } from '../context/LocaleContext';
import { useFolderStore } from '../store/useFolderStore';
import { Folder } from '../types';
import styles from './FolderModal.module.css';

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder?: Folder;
}

const PRESET_COLORS = [
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f43f5e', // Rose
  '#f59e0b', // Amber
  '#0ea5e9', // Sky
  '#8b5cf6', // Violet
  '#d946ef', // Fuchsia
  '#14b8a6', // Teal
];

export function FolderModal({ isOpen, onClose, folder }: FolderModalProps) {
  const { t } = useLocale();
  const createFolder = useFolderStore(state => state.createFolder);
  const updateFolder = useFolderStore(state => state.updateFolder);

  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  useEffect(() => {
    if (folder) {
      setName(folder.name);
      setSelectedColor(folder.color);
    } else {
      setName('');
      setSelectedColor(PRESET_COLORS[0]);
    }
  }, [folder, isOpen]);

  const handleSave = async () => {
    if (!name.trim()) return;

    if (folder) {
      await updateFolder(folder.id, name.trim(), selectedColor);
    } else {
      await createFolder(name.trim(), selectedColor);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay} onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={styles.modal}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.header}>
              <h2>{folder ? t.folders.rename : t.folders.create}</h2>
              <button className={styles.closeBtn} onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.content}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>{t.folders.title}</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder={t.folders.namePlaceholder}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && handleSave()}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>{t.folders.color}</label>
                <div className={styles.colorGrid}>
                  {PRESET_COLORS.map(color => (
                    <div
                      key={color}
                      className={`${styles.colorOption} ${selectedColor === color ? styles.colorActive : ''}`}
                      style={{ background: color }}
                      onClick={() => setSelectedColor(color)}
                    >
                      {selectedColor === color && <Check size={18} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.footer}>
              <button className={`${styles.btn} ${styles.cancelBtn}`} onClick={onClose}>
                {t.common.cancel}
              </button>
              <button
                className={`${styles.btn} ${styles.saveBtn}`}
                onClick={handleSave}
                disabled={!name.trim()}
              >
                {t.common.save || 'Save'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

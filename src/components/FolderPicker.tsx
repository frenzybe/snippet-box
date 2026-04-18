
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus } from 'lucide-react';
import { useFolderStore } from '../store/useFolderStore';
import { useLocale } from '../context/LocaleContext';
import styles from './FolderPicker.module.css';

interface FolderPickerProps {
  snippetId: string;
  isOpen: boolean;
  onClose: () => void;
  onAddNew: () => void;
}

export function FolderPicker({ snippetId, isOpen, onClose, onAddNew }: FolderPickerProps) {
  const { t } = useLocale();
  const folders = useFolderStore(state => state.folders);
  const folderSnippetIds = useFolderStore(state => state.folderSnippetIds);
  const toggleSnippetInFolder = useFolderStore(state => state.toggleSnippetInFolder);

  const isInFolder = (folderId: string) => {
    return folderSnippetIds[folderId]?.includes(snippetId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className={styles.backdrop} onClick={onClose} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className={styles.popover}
          >
            <div className={styles.header}>
              <span>{t.folders.addToFolder}</span>
            </div>
            
            <div className={styles.list}>
              {folders.length === 0 ? (
                <div className={styles.empty}>
                  {t.folders.noFolders}
                </div>
              ) : (
                folders.map(folder => (
                  <div 
                    key={folder.id} 
                    className={styles.item}
                    onClick={() => toggleSnippetInFolder(snippetId, folder.id)}
                  >
                    <div className={styles.folderInfo}>
                      <div className={styles.dot} style={{ background: folder.color }} />
                      <span className={styles.name}>{folder.name}</span>
                    </div>
                    {isInFolder(folder.id) && <Check size={14} className={styles.check} />}
                  </div>
                ))
              )}
            </div>

            <button className={styles.addNew} onClick={() => { onAddNew(); onClose(); }}>
              <Plus size={14} />
              <span>{t.folders.create}</span>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

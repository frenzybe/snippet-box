import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus } from 'lucide-react';
import { FolderItem } from '../components/FolderItem';
import { Folder } from '../../../types';
import styles from '../Sidebar.module.css';

interface FolderSectionProps {
  folders: Folder[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onAddFolder: () => void;
  onEditFolder: (folder: Folder) => void;
  onDeleteFolder: (folder: Folder) => void;
  activeCollection: string;
  setActiveCollection: (id: string) => void;
  folderCounts: Record<string, number>;
  t: any;
}

export const FolderSection: React.FC<FolderSectionProps> = ({
  folders,
  isExpanded,
  onToggleExpand,
  onAddFolder,
  onEditFolder,
  onDeleteFolder,
  activeCollection,
  setActiveCollection,
  folderCounts,
  t
}) => {
  return (
    <div className={styles.section}>
      <div
        className={`${styles.sectionHeader} ${styles.collapsibleHeader}`}
        onClick={onToggleExpand}
      >
        <div className={styles.sectionHeaderTitle}>
          <span>{t.folders.title}</span>
          <motion.div
            animate={{ rotate: isExpanded ? 0 : -90 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={14} />
          </motion.div>
        </div>
        <div className={styles.sectionHeaderActions} onClick={e => e.stopPropagation()}>
          <button
            className={styles.addBtn}
            onClick={onAddFolder}
            title={t.folders.create}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ overflow: 'hidden' }}
          >
            {folders.length === 0 ? (
              <div className={styles.collectionItem} style={{ fontStyle: 'italic', opacity: 0.6 }}>
                <span>{t.folders.noFolders}</span>
              </div>
            ) : (
              folders.map(folder => (
                <FolderItem
                  key={folder.id}
                  folder={folder}
                  isActive={activeCollection === `folder:${folder.id}`}
                  onSelect={() => {
                    if (activeCollection === `folder:${folder.id}`) {
                      setActiveCollection('all');
                    } else {
                      setActiveCollection(`folder:${folder.id}`);
                    }
                  }}
                  onEdit={() => onEditFolder(folder)}
                  onDelete={() => onDeleteFolder(folder)}
                  count={folderCounts[folder.id] || 0}
                  t={t}
                />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

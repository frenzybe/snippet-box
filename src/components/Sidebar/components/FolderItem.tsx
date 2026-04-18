import { motion } from 'framer-motion';

import { MoreVertical, FolderMinus, Pencil, Palette, Trash2 } from 'lucide-react';
import { ContextMenu } from '../../ui/ContextMenu/ContextMenu';
import { useContextMenu } from '../../../hooks/useContextMenu';
import { Folder } from '../../../types';
import styles from '../Sidebar.module.css';

interface FolderItemProps {
  folder: Folder;
  isActive: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  count: number;
  t: any;
}

export const FolderItem = ({
  folder,
  isActive,
  onSelect,
  onEdit,
  onDelete,
  count,
  t
}: FolderItemProps) => {


  const { isOpen, coords, onContextMenu, closeMenu } = useContextMenu();

  const menuItems = [
    { 
      label: t.folders.rename || 'Rename', 
      icon: <Pencil size={14} />, 
      onClick: onEdit 
    },
    { 
      label: t.folders.color || 'Change Color', 
      icon: <Palette size={14} />, 
      onClick: onEdit 
    },
    { divider: true },
    { 
      label: t.common.delete || 'Delete', 
      icon: <Trash2 size={14} />, 
      variant: 'danger' as const,
      onClick: onDelete 
    },
  ];

  return (
    <>
      <motion.div
        className={`${styles.collectionItem} ${isActive ? styles.collectionActive : ''}`}
        onClick={onSelect}
        onContextMenu={onContextMenu}
        animate={{
          backgroundColor: isActive ? 'var(--accent-soft)' : 'transparent'
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
      <div className={styles.folderDot} style={{ background: folder.color }} />
      <span className={styles.itemName}>{folder.name}</span>
      <span className={styles.countBadge}>{count}</span>
      <div className={styles.folderActions}>
        <button
          className={styles.folderActionBtn}
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          title={t.common.edit}
        >
          <MoreVertical size={14} />
        </button>
        <button
          className={styles.folderActionBtn}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title={t.common.delete}
        >
          <FolderMinus size={14} />
        </button>
      </div>
      </motion.div>
      <ContextMenu
        isOpen={isOpen}
        x={coords.x}
        y={coords.y}
        items={menuItems}
        onClose={closeMenu}
      />
    </>
  );
};

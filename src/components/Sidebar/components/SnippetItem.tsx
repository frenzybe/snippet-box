import React from 'react';
import { motion } from 'framer-motion';

import { Files, Star, FolderPlus, FolderMinus, CheckSquare, Copy, Plus, Trash2, Pencil } from 'lucide-react';
import { TechIcon } from '../../ui/TechIcon';
import { Badge } from '../../ui/Badge';
import { IconButton } from '../../ui/IconButton';
import { ContextMenu } from '../../ui/ContextMenu/ContextMenu';
import { useContextMenu } from '../../../hooks/useContextMenu';
import { useToastStore } from '../../../store/useToastStore';
import { Snippet } from '../../../types';
import { ICON_SIZE } from '../../../utils/constants';
import styles from '../Sidebar.module.css';

interface SnippetItemProps {
  snippet: Snippet;
  isActive: boolean;
  isSelected: boolean;

  onSelect: (e: React.MouseEvent, snippet: Snippet) => void;
  onToggleFavorite: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenFolderPicker: (id: string) => void;
  onRemoveFromFolder?: (id: string) => void;
  t: any;
}

export const SnippetItem = React.memo(({
  snippet,
  isActive,
  isSelected,

  onSelect,
  onToggleFavorite,
  onDuplicate,
  onDelete,
  onOpenFolderPicker,
  onRemoveFromFolder,
  t
}: SnippetItemProps) => {


  const addToast = useToastStore(state => state.addToast);
  const { isOpen, coords, onContextMenu, closeMenu } = useContextMenu();

  const handleCopyCode = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (snippet.files.length > 0) {
      navigator.clipboard.writeText(snippet.files[0].code);
      addToast(t.toasts.copied, 'success');
    }
  };

  const menuItems = [
    {
      label: t.common.copy || 'Copy Code',
      icon: <Copy size={14} />,
      shortcut: '⌘C',
      onClick: handleCopyCode
    },
    {
      label: t.common.edit || 'Edit',
      icon: <Pencil size={14} />,
      onClick: () => onSelect({} as any, snippet)
    },
    {
      label: t.common.duplicate || 'Duplicate',
      icon: <Plus size={14} />,
      shortcut: '⌘D',
      onClick: () => onDuplicate(snippet.id)
    },
    { divider: true },
    {
      label: snippet.isFavorite ? t.toasts.favRemoved : t.toasts.favAdded,
      icon: <Star size={14} fill={snippet.isFavorite ? "var(--accent-color)" : "none"} />,
      onClick: () => onToggleFavorite(snippet.id)
    },
    {
      label: t.folders.addToFolder || 'Add to Folder',
      icon: <FolderPlus size={14} />,
      onClick: () => onOpenFolderPicker(snippet.id)
    },
    { divider: true },
    {
      label: t.common.delete || 'Delete',
      icon: <Trash2 size={14} />,
      variant: 'danger' as const,
      shortcut: 'Del',
      onClick: () => onDelete(snippet.id)
    },
  ];

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 40,
          mass: 0.8
        }}
        className={`${styles.snippetItem} ${isActive ? styles.active : ''} ${isSelected ? styles.selected : ''}`}
        onClick={(e) => onSelect(e, snippet)}
        onContextMenu={onContextMenu}
      >
        <div className={styles.main}>
          <div className={styles.iconWrap}>
            <TechIcon lang={snippet.files[0]?.language || 'text'} size={ICON_SIZE.SM} />
          </div>
          <div className={styles.info}>
            <div className={styles.title}>{snippet.title}</div>
            <div className={styles.meta}>
              {snippet.files.length > 1 && (
                <div className={styles.fileCount}>
                  <Files size={ICON_SIZE.XS} />
                  <span>{snippet.files.length}</span>
                </div>
              )}
              {snippet.tags.length > 0 && (
                <div className={styles.tags}>
                  {snippet.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className={styles.tagBadge}>{tag}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className={styles.actions} onClick={e => e.stopPropagation()}>
            {!isSelected && (
              <IconButton
                icon={<Star size={ICON_SIZE.SM} fill={snippet.isFavorite ? "var(--accent-color)" : "none"} />}
                active={snippet.isFavorite}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(snippet.id);
                }}
                variant={snippet.isFavorite ? 'secondary' : 'ghost'}
                size="sm"
              />
            )}
            {!isSelected && onRemoveFromFolder && (
              <IconButton
                icon={<FolderMinus size={ICON_SIZE.SM} />}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFromFolder(snippet.id);
                }}
                variant="ghost"
                size="sm"
                title={t.folders.removeFromFolder}
              />
            )}
            {!isSelected && (
              <IconButton
                icon={<FolderPlus size={ICON_SIZE.SM} />}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenFolderPicker(snippet.id);
                }}
                variant="ghost"
                size="sm"
              />
            )}
            {isSelected && (
              <div className={styles.selectionIndicator}>
                <CheckSquare size={ICON_SIZE.SM} className={styles.selectionToggle} />
              </div>
            )}
          </div>
        </div>
        {isActive && !isSelected && (
          <motion.div
            layoutId="active-pill"
            className={styles.activeIndicator}
          />
        )}
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
});

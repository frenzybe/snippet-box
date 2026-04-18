import React from 'react';
import { Trash2, Pencil, Check, Copy, Eye, EyeOff, GitCompare, Image as ImageIcon } from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ICON_SIZE } from '../../utils/constants';
import styles from './Editor.module.css';

interface EditorHeaderProps {
  title: string;
  language: string;
  isTemplate: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onCopy: () => void;
  copied: boolean;
  copyDisabled?: boolean;
  copyTitle?: string;
  t: any;
  showPreviewToggle?: boolean;
  isPreviewActive?: boolean;
  onTogglePreview?: () => void;
  showDiffToggle?: boolean;
  isDiffActive?: boolean;
  onToggleDiff?: () => void;
  onExport?: () => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  title,
  language,
  isTemplate,
  onDelete,
  onEdit,
  onCopy,
  copied,
  copyDisabled,
  copyTitle,
  t,
  showPreviewToggle = false,
  isPreviewActive = false,
  onTogglePreview,
  showDiffToggle = false,
  isDiffActive = false,
  onToggleDiff,
  onExport
}) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <h2 className={styles.title} title={title}>{title}</h2>
        <div className={styles.headerInfo}>
          {isTemplate && (
            <Badge variant="accent">{t.template.badge}</Badge>
          )}
          <span className={styles.languageLabel}>{language}</span>
        </div>
      </div>
      
      <div className={styles.actions}>
        <div className={styles.actionGroup}>
          {showDiffToggle && (
            <IconButton 
              icon={<GitCompare size={ICON_SIZE.SM} />} 
              onClick={onToggleDiff} 
              title={isDiffActive ? 'Show Code' : 'Show Diff'}
              variant={isDiffActive ? 'secondary' : 'ghost'}
              size="sm"
            />
          )}
          {showPreviewToggle && (
            <IconButton 
              icon={isPreviewActive ? <EyeOff size={ICON_SIZE.SM} /> : <Eye size={ICON_SIZE.SM} />} 
              onClick={onTogglePreview} 
              title={isPreviewActive ? 'Show Code' : 'Show Preview'}
              variant={isPreviewActive ? 'secondary' : 'ghost'}
              size="sm"
            />
          )}
          <IconButton 
            icon={<ImageIcon size={ICON_SIZE.SM} />} 
            onClick={onExport} 
            title="Export as Image"
            variant="ghost"
            size="sm"
          />
          <IconButton 
            icon={<Trash2 size={ICON_SIZE.SM} />} 
            onClick={onDelete} 
            title={t.editor.delete}
            variant="ghost"
            size="sm"
          />
          <IconButton 
            icon={<Pencil size={ICON_SIZE.SM} />} 
            onClick={onEdit} 
            title={t.editor.edit}
            variant="ghost"
            size="sm"
          />
        </div>
        
        <Button 
          variant="primary" 
          size="sm" 
          onClick={onCopy}
          disabled={copyDisabled}
          title={copyTitle}
          leftIcon={copied ? <Check size={ICON_SIZE.SM} /> : <Copy size={ICON_SIZE.SM} />}
        >
          {copied ? t.editor.copied : t.editor.copy}
        </Button>
      </div>
    </div>
  );
};

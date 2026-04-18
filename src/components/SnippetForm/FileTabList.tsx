import React from 'react';
import { Plus, X } from 'lucide-react';
import { TechIcon } from '../ui/TechIcon';
import { IconButton } from '../ui/IconButton';
import styles from './SnippetForm.module.css';
import { SnippetFile } from '../../types';

interface FileTabListProps {
  files: SnippetFile[];
  activeFileId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onRemove: (id: string, e: React.MouseEvent) => void;
}

export const FileTabList: React.FC<FileTabListProps> = ({
  files,
  activeFileId,
  onSelect,
  onAdd,
  onRemove
}) => {
  return (
    <div className={styles.tabsBar}>
      {files.map(f => (
        <div
          key={f.id}
          className={`${styles.fileTab} ${f.id === activeFileId ? styles.fileTabActive : ''}`}
          onClick={() => onSelect(f.id)}
        >
          <TechIcon lang={f.language} size={14} />
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {f.filename || 'Untitled'}
          </span>
          {files.length > 1 && (
            <IconButton 
              icon={<X size={12} />} 
              size="sm" 
              onClick={(e) => onRemove(f.id, e)}
              variant="ghost"
              style={{ width: 18, height: 18, padding: 0 }}
            />
          )}
        </div>
      ))}
      <IconButton 
        icon={<Plus size={16} />} 
        onClick={onAdd}
        title="Add file"
        size="sm"
        variant="secondary"
        style={{ marginLeft: 'auto', marginRight: 16, marginBottom: 8 }}
      />
    </div>
  );
};

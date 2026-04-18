import React from 'react';
import { Code2 } from 'lucide-react';
import styles from './Editor.module.css';
import { SnippetFile } from '../../types';

interface FileTabsProps {
  files: SnippetFile[];
  activeFileId: string | null;
  onSelect: (id: string) => void;
}

export const FileTabs: React.FC<FileTabsProps> = ({
  files,
  activeFileId,
  onSelect
}) => {
  if (files.length <= 1) return null;

  return (
    <div className={styles.fileTabs}>
      {files.map(f => (
        <button
          key={f.id}
          className={`${styles.fileTab} ${f.id === activeFileId ? styles.fileTabActive : ''}`}
          onClick={() => onSelect(f.id)}
        >
          <Code2 size={13} style={{ marginRight: 6 }} />
          {f.filename}
        </button>
      ))}
    </div>
  );
};

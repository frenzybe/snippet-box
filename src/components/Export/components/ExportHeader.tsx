import React from 'react';
import { Download, Copy, Check, X } from 'lucide-react';
import { IconButton } from '../../ui/IconButton';
import styles from '../Export.module.css';

interface ExportHeaderProps {
  filename: string;
  setFilename: (name: string) => void;
  copying: boolean;
  isExporting: boolean;
  onCopy: () => void;
  onDownload: () => void;
  onClose: () => void;
  t: any;
}

export const ExportHeader: React.FC<ExportHeaderProps> = ({
  filename,
  setFilename,
  copying,
  isExporting,
  onCopy,
  onDownload,
  onClose,
  t
}) => {
  return (
    <div className={styles.header}>
      <div className={styles.titleWrap}>
        <div className={styles.filenameInputWrap}>
          <input
            type="text"
            className={styles.filenameInput}
            value={filename}
            onChange={e => setFilename(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onDownload()}
            placeholder="filename"
          />
          <span className={styles.extension}>.png</span>
        </div>
      </div>
      <div className={styles.headerActions}>
        <div className={styles.mainActions}>
          <button
            className={`${styles.headerCopyBtn} ${copying ? styles.success : ''}`}
            onClick={onCopy}
            disabled={copying}
          >
            {copying ? <Check size={16} /> : <Copy size={16} />}
            <span>{copying ? t.export.actions.copied : t.export.actions.copy}</span>
          </button>
          <button
            className={styles.headerDownloadBtn}
            onClick={onDownload}
            disabled={isExporting}
          >
            <Download size={16} />
            <span>{isExporting ? t.export.actions.exporting : t.export.actions.download}</span>
          </button>
        </div>
        <IconButton icon={<X size={20} />} onClick={onClose} variant="ghost" />
      </div>
    </div>
  );
};

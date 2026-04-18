import React from 'react';
import { X, Clock, FileCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { computeSplitDiff } from '../utils/diff';
import { highlightCode } from '../utils/syntax';
import { IconButton } from './ui/IconButton';
import { ICON_SIZE } from '../utils/constants';
import styles from './DiffModal.module.css';

interface SnippetFile {
  id: string;
  filename: string;
  code: string;
  language: string;
}

interface DiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  oldFiles: SnippetFile[];
  newFiles: SnippetFile[];
  title: string;
  versionDate: string;
}

export function DiffModal({ isOpen, onClose, oldFiles, newFiles, title, versionDate }: DiffModalProps) {
  const [activeFileIndex, setActiveFileIndex] = React.useState(0);

  const allFilenames = Array.from(new Set([
    ...oldFiles.map(f => f.filename),
    ...newFiles.map(f => f.filename)
  ]));

  const currentFilename = allFilenames[activeFileIndex] || '';
  const oldFile = oldFiles.find(f => f.filename === currentFilename);
  const newFile = newFiles.find(f => f.filename === currentFilename);

  const oldCode = oldFile?.code || '';
  const newCode = newFile?.code || '';
  const currentLanguage = newFile?.language || oldFile?.language || 'javascript';

  const rows = computeSplitDiff(oldCode, newCode);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={styles.modal}
          >
            <div className={styles.header}>
              <div className={styles.headerInfo}>
                <div className={styles.titleRow}>
                  <Clock size={20} className={styles.titleIcon} />
                  <h2>Version Comparison</h2>
                </div>
                <div className={styles.meta}>
                  <span className={styles.snippetTitle}>{title}</span>
                  <span className={styles.divider}>•</span>
                  <span className={styles.date}>{versionDate}</span>
                </div>
              </div>
              <IconButton
                icon={<X size={ICON_SIZE.MD} />}
                onClick={onClose}
                variant="ghost"
                className={styles.closeIconButton}
              />
            </div>

            <div className={styles.tabBar}>
              {allFilenames.map((name, idx) => {
                const isModified = oldFiles.some(f => f.filename === name) &&
                  newFiles.some(f => f.filename === name) &&
                  oldFiles.find(f => f.filename === name)?.code !==
                  newFiles.find(f => f.filename === name)?.code;
                const isAdded = !oldFiles.some(f => f.filename === name);
                const isRemoved = !newFiles.some(f => f.filename === name);

                return (
                  <button
                    key={name}
                    className={`${styles.tab} ${activeFileIndex === idx ? styles.activeTab : ''}`}
                    onClick={() => setActiveFileIndex(idx)}
                  >
                    <FileCode size={14} className={styles.tabIcon} />
                    <span className={styles.tabName}>{name}</span>
                    {isModified && <span className={`${styles.statusDot} ${styles.dotModified}`} />}
                    {isAdded && <span className={`${styles.statusDot} ${styles.dotAdded}`} />}
                    {isRemoved && <span className={`${styles.statusDot} ${styles.dotRemoved}`} />}
                  </button>
                );
              })}
            </div>

            <div className={styles.diffContainer}>
              <div className={styles.diffHeader}>
                <div className={styles.paneLabel}>
                  <span className={styles.badge}>HISTORY</span>
                  {oldFile ? currentFilename : '(File did not exist)'}
                </div>
                <div className={styles.paneLabel}>
                  <span className={`${styles.badge} ${styles.badgeCurrent}`}>CURRENT</span>
                  {newFile ? currentFilename : '(File deleted)'}
                </div>
              </div>
              <div className={styles.scrollArea}>
                <table className={styles.diffTable}>
                  <tbody>
                    {rows.map((row, idx) => (
                      <tr key={idx} className={styles.diffRow}>
                        {/* Left Side (Old) */}
                        <td className={`${styles.lineNo} ${styles[row.left.type]}`}>
                          {row.left.lineNumber || ''}
                        </td>
                        <td className={`${styles.codeCell} ${styles[row.left.type]}`}>
                          {row.left.type !== 'empty' && (
                            <pre>{highlightCode(row.left.content || ' ', currentLanguage)}</pre>
                          )}
                        </td>

                        {/* Divider */}
                        <td className={styles.gutter} />

                        {/* Right Side (New) */}
                        <td className={`${styles.lineNo} ${styles[row.right.type]}`}>
                          {row.right.lineNumber || ''}
                        </td>
                        <td className={`${styles.codeCell} ${styles[row.right.type]}`}>
                          {row.right.type !== 'empty' && (
                            <pre>{highlightCode(row.right.content || ' ', currentLanguage)}</pre>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.footer}>
              <div className={styles.legend}>
                <div className={styles.legendItem}><div className={`${styles.colorDot} ${styles.bgAdded}`} /> Added</div>
                <div className={styles.legendItem}><div className={`${styles.colorDot} ${styles.bgRemoved}`} /> Removed</div>
              </div>
              <button className={styles.actionBtn} onClick={onClose}>
                Finish Review
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

import React, { useEffect, useState } from 'react';

import { History, RotateCcw, Clock, Trash2 } from 'lucide-react';
import { TechIcon } from './ui/TechIcon';
import { useSnippetStore } from '../store/useSnippetStore';
import { useUIStore } from '../store/useUIStore';
import { sqlStorage } from '../services/sqlStorage';
import { useLocale } from '../context/LocaleContext';
import { IconButton } from './ui/IconButton';
import { ICON_SIZE } from '../utils/constants';
import { DiffModal } from './DiffModal';
import { ask } from '@tauri-apps/plugin-dialog';
import { useToastStore } from '../store/useToastStore';
import { LoadingSpinner } from './ui/Loading';
import styles from './HistoryPanel.module.css';

export function HistoryPanel() {
  const { t } = useLocale();
  const selectedId = useSnippetStore(state => state.selectedId);
  const restoreVersion = useSnippetStore(state => state.restoreVersion);
  const historyRefreshKey = useUIStore(state => state.historyRefreshKey);
  const currentSnippet = useSnippetStore(state =>
    state.snippets.find(s => s.id === state.selectedId)
  );

  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [, setSelectedVersionId] = useState<string | null>(null);
  const [isDiffOpen, setIsDiffOpen] = useState(false);
  const [compareItem, setCompareItem] = useState<any | null>(null);
  const addToast = useToastStore(state => state.addToast);

  useEffect(() => {
    if (selectedId) {
      loadHistory();
    }
  }, [selectedId, historyRefreshKey]);

  const loadHistory = async () => {
    if (!selectedId) return;
    setIsLoading(true);
    try {
      const data = await sqlStorage.getSnippetHistory(selectedId);
      setHistory(data);
      setSelectedVersionId(null);
    } catch (err) {
      console.error("HistoryPanel: Failed to load history:", err);
      addToast(t.toasts.error, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (snippet: any) => {
    if (!window.confirm(t.editor.history?.confirmRestore || 'Are you sure you want to restore this version? Your current unsaved changes will be saved to history first.')) {
      return;
    }

    try {
      await restoreVersion(snippet);
      addToast(t.toasts.updated, 'success');
      loadHistory(); // Refresh history as a new snapshot of the "pre-restored" state is created
    } catch (err) {
      console.error("HistoryPanel: Restore failed:", err);
    }
  };

  const handleCompare = (item: any) => {
    setCompareItem(item);
    setIsDiffOpen(true);
  };

  const handleDeleteHistory = async (e: React.MouseEvent, historyId: string) => {
    e.stopPropagation();
    const confirmed = await ask(t.editor.history?.confirmDelete || 'Are you sure?', {
      title: t.common.delete,
      kind: 'warning'
    });

    if (confirmed) {
      try {
        await sqlStorage.deleteSnippetHistoryEntry(historyId);
        setHistory(prev => prev.filter(item => item.historyId !== historyId));
        addToast(t.toasts.deleted, 'success');
      } catch (err) {
        addToast(t.toasts.error, 'error');
      }
    }
  };

  const handleClearAllHistory = async () => {
    if (!selectedId) return;
    const confirmed = await ask(t.common.confirmClearAll, {
      title: t.common.clearAll,
      kind: 'warning'
    });

    if (confirmed) {
      try {
        await sqlStorage.clearSnippetHistory(selectedId);
        await loadHistory();
        addToast(t.toasts.bulkDeleted.replace('{count}', history.length.toString()), 'success');
      } catch (err) {
        addToast(t.toasts.error, 'error');
      }
    }
  };

  if (!selectedId) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerTitleGroup}>
            <History size={ICON_SIZE.MD} className={styles.headerIcon} />
            <div className={styles.titleWithCount}>
              <h3>{t.editor.tabs.history}</h3>
              {history.length > 0 && (
                <span className={styles.versionCountBadge}>
                  {history.length} {t.common.versionsCount || 'versions'}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className={styles.headerActions}>
          <IconButton
            icon={<RotateCcw size={ICON_SIZE.SM} />}
            size="sm"
            variant="ghost"
            onClick={loadHistory}
            title={t.editor.tabs.history}
          />
          {history.length > 0 && (
            <IconButton
              icon={<Trash2 size={ICON_SIZE.SM} />}
              size="sm"
              variant="ghost"
              onClick={handleClearAllHistory}
              title={t.common.clearAll}
              className={styles.clearAllBtn}
            />
          )}
        </div>
      </div>

      <div className={styles.list}>
        {isLoading ? (
          <div className={styles.empty}>
            <LoadingSpinner text={t.common?.loading || 'Loading history...'} />
          </div>
        ) : history.length === 0 ? (
          <div className={styles.empty}>
            <Clock size={48} opacity={0.2} />
            <p>{t.editor.history?.noHistory || 'No previous versions found.'}</p>
            <span>{t.editor.history?.noHistoryDesc || 'History is created automatically when you update a snippet.'}</span>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.historyId}
              className={styles.historyItem}
              onClick={() => handleCompare(item)}
            >
              <div className={styles.itemHeader}>
                <div className={styles.itemMain}>
                  <div className={styles.itemMeta}>
                    <Clock size={14} />
                    <span>{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                  <div className={styles.itemTitle} title={item.snippet.title}>
                    {item.snippet.title}
                  </div>
                </div>

                <div className={styles.itemActionsHeader}>
                  <IconButton
                    icon={<RotateCcw size={16} />}
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRestore(item.snippet);
                    }}
                    title={t.common?.restore}
                  />
                  <IconButton
                    icon={<Trash2 size={16} />}
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleDeleteHistory(e, item.historyId)}
                    title={t.common?.delete || 'Delete'}
                    className={styles.deleteBtn}
                  />
                </div>
              </div>

              <div className={styles.itemBottom}>
                <div className={styles.fileTags}>
                  {item.snippet.files.map((f: any) => (
                    <span key={f.id} className={styles.fileTag}>
                      <TechIcon lang={f.language} size={10} />
                      {f.filename}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          ))
        )}
      </div>

      {compareItem && (
        <DiffModal
          isOpen={isDiffOpen}
          onClose={() => setIsDiffOpen(false)}
          oldFiles={compareItem.snippet.files || []}
          newFiles={currentSnippet?.files || []}
          title={compareItem.snippet.title}
          versionDate={new Date(compareItem.createdAt).toLocaleString()}
        />
      )}
    </div>
  );
}

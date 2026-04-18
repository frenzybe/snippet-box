import React from 'react';
import { LayoutGroup, AnimatePresence } from 'framer-motion';
import { SearchX, Star as StarIcon, FolderOpen, Library } from 'lucide-react';
import { SnippetItem } from '../components/SnippetItem';
import { EmptyState } from '../../EmptyState';
import { Badge } from '../../ui/Badge';
import { Snippet } from '../../../types';
import emptyStyles from '../../EmptyState.module.css';
import styles from '../Sidebar.module.css';

interface SnippetListSectionProps {
  sortedSnippets: Snippet[];
  selectedId: string | null;
  selectedIds: string[];

  activeCollection: string;
  searchQuery: string;
  onSnippetClick: (e: React.MouseEvent, snippet: Snippet) => void;
  onToggleFavorite: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenFolderPicker: (id: string) => void;
  onRemoveFromFolder?: (id: string) => void;
  onResetSearch: () => void;
  t: any;
}

export const SnippetListSection: React.FC<SnippetListSectionProps> = ({
  sortedSnippets,
  selectedId,
  selectedIds,

  activeCollection,
  searchQuery,
  onSnippetClick,
  onToggleFavorite,
  onDuplicate,
  onDelete,
  onOpenFolderPicker,
  onRemoveFromFolder,
  onResetSearch,
  t
}) => {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span>{t.sidebar.snippets.replace('{count}', sortedSnippets.length.toString())}</span>
        {selectedIds.length > 0 && (
          <Badge variant="accent">{selectedIds.length} {t.sidebar.selected}</Badge>
        )}
      </div>

      <LayoutGroup>
        <div className={styles.virtualizedList}>
          {sortedSnippets.length > 0 ? (
            <AnimatePresence mode="popLayout" initial={false}>
              {sortedSnippets.map((snippet) => (
                <SnippetItem
                  key={snippet.id}
                  snippet={snippet}
                  isActive={selectedId === snippet.id}
                  isSelected={selectedIds.includes(snippet.id)}
                  onSelect={onSnippetClick}
                  onToggleFavorite={onToggleFavorite}
                  onDuplicate={onDuplicate}
                  onDelete={onDelete}
                  onOpenFolderPicker={onOpenFolderPicker}
                  onRemoveFromFolder={onRemoveFromFolder}
                  t={t}
                />
              ))}
            </AnimatePresence>
          ) : (
            <div style={{ padding: '20px 0' }}>
              <EmptyState
                compact
                icon={searchQuery ? SearchX : (activeCollection === 'favorites' ? StarIcon : (activeCollection.startsWith('folder:') ? FolderOpen : Library))}
                title={
                  searchQuery
                    ? t.search.noResults
                    : activeCollection === 'favorites' 
                      ? t.empty.noFavorites 
                      : activeCollection.startsWith('folder:') 
                        ? t.empty.noFolderSnippets 
                        : (!['all', 'favorites', 'recent'].includes(activeCollection) && !activeCollection.startsWith('folder:'))
                          ? t.empty.noLanguageSnippets.replace('{lang}', activeCollection)
                          : t.search.addHint
                }
                description={
                  searchQuery
                    ? t.search.noResultsDesc
                    : activeCollection === 'favorites' 
                      ? t.empty.noFavoritesDesc 
                      : activeCollection.startsWith('folder:') 
                        ? t.empty.noFolderSnippetsDesc 
                        : (!['all', 'favorites', 'recent'].includes(activeCollection) && !activeCollection.startsWith('folder:'))
                          ? t.empty.noLanguageSnippetsDesc.replace('{lang}', activeCollection)
                          : t.search.addHintDesc
                }
                action={
                  (activeCollection !== 'all' || searchQuery) && (
                    <button 
                      className={emptyStyles.button} 
                      onClick={onResetSearch}
                    >
                      {t.common.showAll}
                    </button>
                  )
                }
              />
            </div>
          )}
        </div>
      </LayoutGroup>
    </div>
  );
};

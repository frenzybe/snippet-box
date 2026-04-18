import React from 'react';
import { Star, Clock, Infinity as AllIcon } from 'lucide-react';
import { useSnippetStore } from '../../../store/useSnippetStore';
import { useToastStore } from '../../../store/useToastStore';
import styles from '../Sidebar.module.css';

interface LibrarySectionProps {
  activeCollection: string;
  setActiveCollection: (id: string) => void;
  counts: {
    all: number;
    favorites: number;
    recent: number;
  };
  t: any;
}

export const LibrarySection: React.FC<LibrarySectionProps> = ({
  activeCollection,
  setActiveCollection,
  counts,
  t
}) => {
  const addToast = useToastStore(state => state.addToast);

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span>{t.sidebar.library}</span>
      </div>

      <div
        className={`${styles.collectionItem} ${activeCollection === 'all' ? styles.collectionActive : ''}`}
        onClick={() => setActiveCollection('all')}
      >
        <AllIcon size={16} className={styles.collectionIcon} />
        <span>{t.sidebar.allSnippets}</span>
        <span className={styles.countBadge}>{counts.all}</span>
      </div>

      <div
        className={`${styles.collectionItem} ${activeCollection === 'favorites' ? styles.collectionActive : ''}`}
        onClick={() => {
          const hasFavorites = useSnippetStore.getState().snippets.some(s => s.isFavorite);
          if (!hasFavorites) {
            addToast(t.toasts.noFavoritesYet, 'info');
            return;
          }
          if (activeCollection === 'favorites') {
            setActiveCollection('all');
          } else {
            setActiveCollection('favorites');
          }
        }}
      >
        <Star size={16} className={styles.collectionIcon} />
        <span>{t.sidebar.favorites}</span>
        <span className={styles.countBadge}>{counts.favorites}</span>
      </div>

      <div
        className={`${styles.collectionItem} ${activeCollection === 'recent' ? styles.collectionActive : ''}`}
        onClick={() => {
          if (activeCollection === 'recent') {
            setActiveCollection('all');
          } else {
            setActiveCollection('recent');
          }
        }}
      >
        <Clock size={16} className={styles.collectionIcon} />
        <span>{t.sidebar.recentlyUpdated}</span>
        <span className={styles.countBadge}>{counts.recent}</span>
      </div>
    </div>
  );
};

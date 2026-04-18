import { useLocale } from '../context/LocaleContext';
import { useShallow } from 'zustand/react/shallow';
import { useSnippetStore, selectAllTags } from '../store/useSnippetStore';
import { Badge } from './ui/Badge';
import styles from './TagFilter.module.css';

export function TagFilter() {
  const { t } = useLocale();
  const allTags = useSnippetStore(useShallow(selectAllTags));
  const activeTag = useSnippetStore(state => state.activeTag);
  const setActiveTag = useSnippetStore(state => state.setActiveTag);

  if (allTags.length === 0) return null;

  return (
    <div className={styles.bar}>
      <Badge
        className={styles.tagPill}
        variant={activeTag === null ? 'accent' : 'outline'}
        onClick={() => setActiveTag(null)}
      >
        {t.tags.all}
      </Badge>
      {allTags.map((tag) => (
        <Badge
          key={tag}
          className={styles.tagPill}
          variant={activeTag === tag ? 'accent' : 'outline'}
          onClick={() => setActiveTag(activeTag === tag ? null : tag)}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}

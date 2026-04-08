import { useLocale } from '../context/LocaleContext';

interface TagFilterProps {
  allTags: string[];
  activeTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export function TagFilter({ allTags, activeTag, onSelectTag }: TagFilterProps) {
  const { t } = useLocale();
  if (allTags.length === 0) return null;

  return (
    <div className="tag-filter-bar">
      <span
        className={`tag-filter-pill ${activeTag === null ? 'active' : ''}`}
        onClick={() => onSelectTag(null)}
      >
        {t.tags.all}
      </span>
      {allTags.map((tag) => (
        <span
          key={tag}
          className={`tag-filter-pill ${activeTag === tag ? 'active' : ''}`}
          onClick={() => onSelectTag(activeTag === tag ? null : tag)}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

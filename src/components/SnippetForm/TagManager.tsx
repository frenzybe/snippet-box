import React, { useState } from 'react';
import { Hash } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { ICON_SIZE } from '../../utils/constants';
import { useLocale } from '../../context/LocaleContext';
import styles from './SnippetForm.module.css';

interface TagManagerProps {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  label: string;
}

export const TagManager: React.FC<TagManagerProps> = ({
  tags,
  onAdd,
  onRemove,
  label
}) => {
  const { t } = useLocale();
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const val = input.trim().toLowerCase();
    if (val) {
      onAdd(val);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAdd();
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onRemove(tags[tags.length - 1]);
    }
  };

  return (
    <div className={styles.tagSection}>
      <label className={styles.label}>{label}</label>
      <div className={styles.tagInputWrapper}>
        <Hash size={ICON_SIZE.SM} style={{ color: 'var(--text-secondary)', marginLeft: 4 }} />
        {tags.map(t => (
          <Badge key={t} variant="accent" onRemove={() => onRemove(t)}>
            {t}
          </Badge>
        ))}
        <input 
          className={styles.tagInput}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleAdd}
          placeholder={t.snippetForm.tagsPlaceholder}
        />
      </div>
    </div>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { TechIcon } from '../../ui/TechIcon';
import styles from '../Sidebar.module.css';

interface LanguageSectionProps {
  languages: string[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  activeCollection: string;
  setActiveCollection: (id: string) => void;
  languageCounts: Record<string, number>;
  t: any;
}

export const LanguageSection: React.FC<LanguageSectionProps> = ({
  languages,
  isExpanded,
  onToggleExpand,
  activeCollection,
  setActiveCollection,
  languageCounts,
  t
}) => {
  return (
    <div className={styles.section}>
      <div
        className={`${styles.sectionHeader} ${styles.collapsibleHeader}`}
        onClick={onToggleExpand}
      >
        <span>{t.sidebar.languages}</span>
        <motion.div
          animate={{ rotate: isExpanded ? 0 : -90 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} />
        </motion.div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ overflow: 'hidden' }}
          >
            {languages.map(lang => (
              <div
                key={lang}
                className={`${styles.collectionItem} ${activeCollection === lang ? styles.collectionActive : ''}`}
                onClick={() => {
                  if (activeCollection === lang) {
                    setActiveCollection('all');
                  } else {
                    setActiveCollection(lang);
                  }
                }}
              >
                <TechIcon lang={lang} size={16} className={styles.collectionIcon} />
                <span className={styles.itemName} style={{ textTransform: 'capitalize' }}>{lang}</span>
                <span className={styles.countBadge}>{languageCounts[lang.toLowerCase()] || 0}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

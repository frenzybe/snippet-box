import React from 'react';
import { Type, Code2, Hash, MousePointer2 } from 'lucide-react';
import { useLocale } from '../../../context/LocaleContext';
import { useSettingsStore } from '../../../store/useSettingsStore';
import styles from '../Settings.module.css';

export const EditorSettings: React.FC = () => {
  const { t } = useLocale();
  const { 
    fontSize, setFontSize,
    tabSize, setTabSize,
    showLineNumbers, setShowLineNumbers,
    highlightActiveLine, setHighlightActiveLine
  } = useSettingsStore();

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{t.settings.sections.editor}</h3>

      <div className={styles.row}>
        <div className={styles.info}>
          <div className={styles.label}>
            <Type size={15} />
            {t.settings.fontSize}
          </div>
        </div>
        <div className={styles.segmentControl}>
          {[12, 14, 16, 18, 20].map(size => (
            <button
              key={size}
              className={`${styles.segmentBtn} ${fontSize === size ? styles.segmentBtnActive : ''}`}
              onClick={() => setFontSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.info}>
          <div className={styles.label}>
            <Code2 size={15} />
            {t.settings.tabSize}
          </div>
        </div>
        <div className={styles.segmentControl}>
          {[2, 4].map(size => (
            <button
              key={size}
              className={`${styles.segmentBtn} ${tabSize === size ? styles.segmentBtnActive : ''}`}
              onClick={() => setTabSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.info}>
          <div className={styles.label}>
            <Hash size={15} />
            {t.settings.showLineNumbers}
          </div>
        </div>
        <div className={styles.segmentControl}>
          <button
            className={`${styles.segmentBtn} ${showLineNumbers ? styles.segmentBtnActive : ''}`}
            onClick={() => setShowLineNumbers(true)}
          >
            {t.common.on}
          </button>
          <button
            className={`${styles.segmentBtn} ${!showLineNumbers ? styles.segmentBtnActive : ''}`}
            onClick={() => setShowLineNumbers(false)}
          >
            {t.common.off}
          </button>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.info}>
          <div className={styles.label}>
            <MousePointer2 size={15} />
            {t.settings.highlightActiveLine}
          </div>
        </div>
        <div className={styles.segmentControl}>
          <button
            className={`${styles.segmentBtn} ${highlightActiveLine ? styles.segmentBtnActive : ''}`}
            onClick={() => setHighlightActiveLine(true)}
          >
            {t.common.on}
          </button>
          <button
            className={`${styles.segmentBtn} ${!highlightActiveLine ? styles.segmentBtnActive : ''}`}
            onClick={() => setHighlightActiveLine(false)}
          >
            {t.common.off}
          </button>
        </div>
      </div>
    </div>
  );
};

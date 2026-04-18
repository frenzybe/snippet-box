import React from 'react';
import { Palette, Languages, Check } from 'lucide-react';
import { useLocale } from '../../../context/LocaleContext';
import { useSettingsStore } from '../../../store/useSettingsStore';
import { AppTheme } from '../../../types';
import styles from '../Settings.module.css';

const THEMES: { id: AppTheme; primary: string; accent: string }[] = [
  { id: 'light', primary: '#ffffff', accent: '#007aff' },
  { id: 'dark', primary: '#1e1e1e', accent: '#007aff' },
  { id: 'dracula', primary: '#282a36', accent: '#bd93f9' },
  { id: 'onedark', primary: '#282c34', accent: '#61afef' },
  { id: 'nord', primary: '#2e3440', accent: '#88c0d0' },
];

export const AppearanceSettings: React.FC = () => {
  const { t, locale, setLocale } = useLocale();
  const { 
    theme, setTheme, 
    iconPack, setIconPack,
    lineWrapping, setLineWrapping 
  } = useSettingsStore();

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{t.settings.sections.appearance}</h3>

      {/* Theme Setting */}
      <div className={styles.themeSection}>
        <div className={styles.label} style={{ marginBottom: '12px' }}>
          <Palette size={15} />
          {t.settings.theme}
        </div>
        <div className={styles.themeGrid}>
          {THEMES.map(tOption => (
            <div
              key={tOption.id}
              className={`${styles.themeCard} ${theme === tOption.id ? styles.themeCardActive : ''}`}
              onClick={() => setTheme(tOption.id)}
            >
              <div className={styles.themePreview}>
                <div className={styles.themePreviewPrimary} style={{ background: tOption.primary }} />
                <div className={styles.themePreviewAccent} style={{ background: tOption.accent }} />
              </div>
              <span className={styles.themeLabel}>{tOption.id}</span>
              {theme === tOption.id && <Check size={12} className={styles.checkIcon} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: '24px' }} />

      {/* Language Setting */}
      <div className={styles.row}>
        <div className={styles.info}>
          <div className={styles.label}>
            <Languages size={15} />
            {t.settings.language}
          </div>
        </div>
        <div className={styles.segmentControl}>
          <button
            className={`${styles.segmentBtn} ${locale === 'en' ? styles.segmentBtnActive : ''}`}
            onClick={() => setLocale('en')}
          >
            English
          </button>
          <button
            className={`${styles.segmentBtn} ${locale === 'ru' ? styles.segmentBtnActive : ''}`}
            onClick={() => setLocale('ru')}
          >
            Русский
          </button>
        </div>
      </div>

      {/* Icon Pack Setting */}
      <div className={styles.row}>
        <div className={styles.info}>
          <div className={styles.label}>
            <Palette size={15} />
            {t.settings.iconStyle}
          </div>
        </div>
        <div className={styles.segmentControl}>
          {(['brand', 'classic', 'minimal'] as const).map((pack) => (
            <button
              key={pack}
              className={`${styles.segmentBtn} ${iconPack === pack ? styles.segmentBtnActive : ''}`}
              onClick={() => setIconPack(pack)}
            >
              {t.settings.iconPacks[pack]}
            </button>
          ))}
        </div>
      </div>

      {/* Line Wrapping Setting */}
      <div className={styles.row}>
        <div className={styles.info}>
          <div className={styles.label}>
            {t.settings.lineWrapping}
          </div>
        </div>
        <div className={styles.segmentControl}>
          <button
            className={`${styles.segmentBtn} ${lineWrapping ? styles.segmentBtnActive : ''}`}
            onClick={() => setLineWrapping(true)}
          >
            {t.common.on}
          </button>
          <button
            className={`${styles.segmentBtn} ${!lineWrapping ? styles.segmentBtnActive : ''}`}
            onClick={() => setLineWrapping(false)}
          >
            {t.common.off}
          </button>
        </div>
      </div>
    </div>
  );
};

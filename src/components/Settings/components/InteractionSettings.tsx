import React from 'react';
import { Keyboard } from 'lucide-react';
import { useLocale } from '../../../context/LocaleContext';
import { usePlatform } from '../../../context/PlatformContext';
import { useSettingsStore } from '../../../store/useSettingsStore';
import { Select } from '../../ui/Select';
import styles from '../Settings.module.css';

export const InteractionSettings: React.FC = () => {
  const { t } = useLocale();
  const { resolvePlaceholders, getPlatformKey } = usePlatform();
  const { hotkey, setHotkey, hideOnCopy, setHideOnCopy } = useSettingsStore();

  const SHORTCUT_OPTIONS = [
    { value: 'CommandOrControl+Shift+Space', label: `${getPlatformKey('mod')} + Shift + Space` },
    { value: 'CommandOrControl+Shift+X', label: `${getPlatformKey('mod')} + Shift + X` },
    { value: 'CommandOrControl+Option+Space', label: `${getPlatformKey('mod')} + ${getPlatformKey('opt')} + Space` },
    { value: 'Alt+C', label: `${getPlatformKey('opt')} + C` },
    { value: 'Control+Shift+Space', label: 'Ctrl + Shift + Space' }
  ];

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{t.settings.sections.interaction}</h3>

      <div className={styles.row}>
        <div className={styles.info}>
          <div className={styles.label}>
            <Keyboard size={15} />
            {t.settings.hotkey}
          </div>
          <div className={styles.desc}>{resolvePlaceholders(t.settings.hotkeyHint)}</div>
        </div>
        <Select
          style={{ width: '180px' }}
          value={hotkey}
          options={SHORTCUT_OPTIONS}
          onChange={(e) => setHotkey(e.target.value)}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.info}>
          <div className={styles.label}>
            {t.settings.hideOnCopy}
          </div>
        </div>
        <div className={styles.segmentControl}>
          <button
            className={`${styles.segmentBtn} ${hideOnCopy ? styles.segmentBtnActive : ''}`}
            onClick={() => setHideOnCopy(true)}
          >
            {t.common.on}
          </button>
          <button
            className={`${styles.segmentBtn} ${!hideOnCopy ? styles.segmentBtnActive : ''}`}
            onClick={() => setHideOnCopy(false)}
          >
            {t.common.off}
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ListOrdered, AlignLeft, Check } from 'lucide-react';
import { EXPORT_FONTS, ExportFont } from '../../../utils/exportFonts';
import styles from '../Export.module.css';

interface ExportEditorSettingsProps {
  fontSize: number;
  setFontSize: (val: number) => void;
  selectedFont: ExportFont;
  setSelectedFont: (font: ExportFont) => void;
  lineNumbers: boolean;
  setLineNumbers: (val: boolean) => void;
  lineWrapping: boolean;
  setLineWrapping: (val: boolean) => void;
  t: any;
}

export const ExportEditorSettings: React.FC<ExportEditorSettingsProps> = ({
  fontSize, setFontSize,
  selectedFont, setSelectedFont,
  lineNumbers, setLineNumbers,
  lineWrapping, setLineWrapping,
  t
}) => {
  return (
    <div className={styles.settingGroup}>
      {/* Font Size */}
      <div className={styles.rangeGroup}>
        <div className={styles.rangeLabel}>
          <span>{t.export.editor.fontSize}</span>
          <span>{fontSize}px</span>
        </div>
        <input
          type="range"
          min="10"
          max="40"
          value={fontSize}
          onChange={e => setFontSize(parseInt(e.target.value))}
          style={{ '--progress': `${((fontSize - 10) / 30) * 100}%` } as any}
        />
      </div>

      {/* Font Selection */}
      <div className={styles.fontPickerList}>
        {EXPORT_FONTS.map(f => (
          <button
            key={f.id}
            className={`${styles.fontOption} ${selectedFont.id === f.id ? styles.active : ''}`}
            style={{ fontFamily: f.family }}
            onClick={() => setSelectedFont(f)}
          >
            <span>{f.name}</span>
            {selectedFont.id === f.id && <Check size={14} />}
          </button>
        ))}
      </div>

      {/* Toggles */}
      <div className={styles.toggleRow}>
        <label className={styles.toggleLabel}>
          <div className={styles.labelWithIcon}>
            <ListOrdered size={14} />
            <span>{t.export.editor.lineNumbers}</span>
          </div>
          <div className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={lineNumbers}
              onChange={e => setLineNumbers(e.target.checked)}
            />
            <div className={styles.toggleSlider} />
          </div>
        </label>

        <label className={styles.toggleLabel}>
          <div className={styles.labelWithIcon}>
            <AlignLeft size={14} />
            <span>{t.export.editor.lineWrap}</span>
          </div>
          <div className={styles.toggleSwitch}>
            <input
              type="checkbox"
              checked={lineWrapping}
              onChange={e => setLineWrapping(e.target.checked)}
            />
            <div className={styles.toggleSlider} />
          </div>
        </label>
      </div>
    </div>
  );
};

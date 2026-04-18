import React from 'react';
import { Minimize2, Maximize2 } from 'lucide-react';
import styles from '../Export.module.css';

interface CanvasSettingsProps {
  padding: number;
  setPadding: (val: number) => void;
  windowStyle: 'macOS' | 'minimal' | 'glass';
  setWindowStyle: (val: 'macOS' | 'minimal' | 'glass') => void;
  cornerRadius: number;
  setCornerRadius: (val: number) => void;
  shadowOpacity: number;
  setShadowOpacity: (val: number) => void;
  scale: number;
  setScale: (val: number | ((prev: number) => number)) => void;
  isMarkdown: boolean;
  markdownPreview: boolean;
  setMarkdownPreview: (val: boolean) => void;
  t: any;
}

export const CanvasSettings: React.FC<CanvasSettingsProps> = ({
  padding, setPadding,
  windowStyle, setWindowStyle,
  cornerRadius, setCornerRadius,
  shadowOpacity, setShadowOpacity,
  scale, setScale,
  isMarkdown,
  markdownPreview, setMarkdownPreview,
  t
}) => {
  return (
    <div className={styles.settingGroup}>
      {/* Outer Space */}
      <div className={styles.rangeGroup}>
        <div className={styles.rangeLabel}>
          <span>{t.export.config.outerSpace}</span>
          <span>{padding}px</span>
        </div>
        <input
          type="range"
          min="16"
          max="128"
          value={padding}
          onChange={e => setPadding(parseInt(e.target.value))}
          style={{ '--progress': `${((padding - 16) / 112) * 100}%` } as any}
        />
      </div>

      {/* Window Style */}
      <div className={styles.rangeGroup}>
        <label className={styles.groupSubLabel}>{t.export.config.windowStyle}</label>
        <div className={styles.btnGroup}>
          {(['macOS', 'minimal', 'glass'] as const).map(style => (
            <button
              key={style}
              className={`${styles.optionBtn} ${windowStyle === style ? styles.active : ''}`}
              onClick={() => setWindowStyle(style)}
            >
              {style.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Corner Radius */}
      <div className={styles.rangeGroup}>
        <div className={styles.rangeLabel}>
          <span>{t.export.config.cornerRadius}</span>
          <span>{cornerRadius}px</span>
        </div>
        <input
          type="range"
          min="0"
          max="32"
          value={cornerRadius}
          onChange={e => setCornerRadius(parseInt(e.target.value))}
          style={{ '--progress': `${(cornerRadius / 32) * 100}%` } as any}
        />
      </div>

      {/* Shadow Intensity */}
      <div className={styles.rangeGroup}>
        <div className={styles.rangeLabel}>
          <span>{t.export.config.shadowIntensity}</span>
          <span>{Math.round(shadowOpacity * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={shadowOpacity * 100}
          onChange={e => setShadowOpacity(parseInt(e.target.value) / 100)}
          style={{ '--progress': `${shadowOpacity * 100}%` } as any}
        />
      </div>

      {/* Markdown Preview Toggle */}
      {isMarkdown && (
        <div className={styles.rangeGroup}>
          <label className={styles.groupSubLabel}>{t.export.config.markdownView}</label>
          <div className={styles.btnGroup}>
            <button 
              className={`${styles.optionBtn} ${!markdownPreview ? styles.active : ''}`}
              onClick={() => setMarkdownPreview(false)}
            >
              {t.export.config.markdownCode}
            </button>
            <button 
              className={`${styles.optionBtn} ${markdownPreview ? styles.active : ''}`}
              onClick={() => setMarkdownPreview(true)}
            >
              {t.export.config.markdownPreview}
            </button>
          </div>
        </div>
      )}

      {/* Preview Zoom */}
      <div className={styles.rangeGroup}>
        <div className={styles.rangeLabel}>
          <span>{t.export.config.previewZoom}</span>
        </div>
        <div className={styles.zoomControl}>
          <button onClick={() => setScale(s => Math.max(0.2, s - 0.1))}><Minimize2 size={14} /></button>
          <input
            type="range"
            min="20"
            max="100"
            value={scale * 100}
            onChange={e => setScale(parseInt(e.target.value) / 100)}
            style={{ '--progress': `${((scale * 100 - 20) / 80) * 100}%` } as any}
          />
          <button onClick={() => setScale(s => Math.min(1.5, s + 0.1))}><Maximize2 size={14} /></button>
        </div>
      </div>
    </div>
  );
};

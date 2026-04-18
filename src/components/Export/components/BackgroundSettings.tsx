import React from 'react';
import { Check, X } from 'lucide-react';
import { ExportBackground, EXPORT_GRADIENTS, EXPORT_COLORS } from '../../../utils/exportGradients';
import styles from '../Export.module.css';

interface BackgroundSettingsProps {
  creator: {
    type: 'solid' | 'gradient';
    color1: string;
    color2: string;
    angle: number;
  };
  updateCreator: (updates: any) => void;
  handleCreateBg: () => void;
  customBgs: ExportBackground[];
  deleteCustomBg: (id: string, e: React.MouseEvent) => void;
  selectedBg: ExportBackground;
  setSelectedBg: (bg: ExportBackground) => void;
  isLive: boolean;
  setIsLive: (val: boolean) => void;
  t: any;
}

export const BackgroundSettings: React.FC<BackgroundSettingsProps> = ({
  creator,
  updateCreator,
  handleCreateBg,
  customBgs,
  deleteCustomBg,
  selectedBg,
  setSelectedBg,
  isLive,
  setIsLive,
  t
}) => {
  return (
    <div className={styles.settingGroup}>
      {/* Creator Panel */}
      <div className={styles.creatorPanel}>
        <div className={styles.creatorType}>
          <button
            className={`${styles.typeBtn} ${creator.type === 'solid' ? styles.active : ''}`}
            onClick={() => updateCreator({ type: 'solid' })}
          >
            {t.export.background.solid}
          </button>
          <button
            className={`${styles.typeBtn} ${creator.type === 'gradient' ? styles.active : ''}`}
            onClick={() => updateCreator({ type: 'gradient' })}
          >
            {t.export.background.gradient}
          </button>
        </div>

        <div className={styles.creatorRow}>
          <div className={styles.creatorField}>
            <span className={styles.fieldLabel}>{t.export.background.start}</span>
            <div className={styles.colorInputWrap}>
              <input
                type="color"
                value={creator.color1}
                onChange={e => updateCreator({ color1: e.target.value })}
              />
            </div>
          </div>

          {creator.type === 'gradient' && (
            <>
              <div className={styles.creatorField}>
                <span className={styles.fieldLabel}>{t.export.background.end}</span>
                <div className={styles.colorInputWrap}>
                  <input
                    type="color"
                    value={creator.color2}
                    onChange={e => updateCreator({ color2: e.target.value })}
                  />
                </div>
              </div>
              <div className={styles.creatorField} style={{ flex: 1 }}>
                <span className={styles.fieldLabel}>{t.export.background.angle}</span>
                <div className={styles.angleInputWrap}>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={creator.angle}
                    onChange={e => updateCreator({ angle: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </>
          )}
          <button
            className={styles.addToLibBtn}
            onClick={handleCreateBg}
            title={t.export.background.addToLib}
          >
            <Check size={16} />
          </button>
        </div>
      </div>

      {/* My Styles */}
      {customBgs.length > 0 && (
        <div className={styles.subCategory}>
          <span className={styles.subTitle}>{t.export.background.myLibrary}</span>
          <div className={styles.scrollGrid}>
            {customBgs.map(bg => (
              <div key={bg.id} className={styles.bgWrapper}>
                <button
                  className={`${styles.gradientBtn} ${(!isLive && selectedBg.id === bg.id) ? styles.active : ''}`}
                  style={{ background: bg.value }}
                  onClick={() => {
                    setSelectedBg(bg);
                    setIsLive(false);
                  }}
                >
                  {(!isLive && selectedBg.id === bg.id) && <Check size={14} className={styles.checkIcon} />}
                </button>
                <button
                  className={styles.deleteBgBtn}
                  onClick={(e) => deleteCustomBg(bg.id, e)}
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Presets */}
      <div className={styles.subCategory}>
        <span className={styles.subTitle}>{t.export.background.presets}</span>
        <div className={styles.scrollGrid}>
          {[...EXPORT_GRADIENTS, ...EXPORT_COLORS].map(bg => (
            <button
              key={bg.id}
              className={`${styles.gradientBtn} ${(!isLive && selectedBg.id === bg.id) ? styles.active : ''}`}
              style={{ background: bg.value }}
              onClick={() => {
                setSelectedBg(bg);
                setIsLive(false);
              }}
              title={bg.name}
            >
              {(!isLive && selectedBg.id === bg.id) && <Check size={14} className={styles.checkIcon} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

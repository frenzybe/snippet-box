import { motion } from 'framer-motion';
import { X, Settings, Keyboard, Languages, Palette, Download, Upload, ChevronDown } from 'lucide-react';
import { useLocale } from '../context/LocaleContext';

interface SettingsModalProps {
  onClose: () => void;
  theme: 'dark' | 'light';
  onThemeChange: (theme: 'dark' | 'light') => void;
  hotkey: string;
  onHotkeyChange: (hotkey: string) => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SHORTCUT_OPTIONS = [
  { value: 'CommandOrControl+Shift+Space', label: 'Cmd + Shift + Space' },
  { value: 'CommandOrControl+Shift+X', label: 'Cmd + Shift + X' },
  { value: 'CommandOrControl+Option+Space', label: 'Cmd + Option + Space' },
  { value: 'Alt+C', label: 'Option + C' },
  { value: 'Control+Shift+Space', label: 'Ctrl + Shift + Space' }
];

export function SettingsModal({ onClose, theme, onThemeChange, hotkey, onHotkeyChange, onExport, onImport }: SettingsModalProps) {
  const { t, locale, setLocale } = useLocale();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-box"
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.15 }}
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '420px' }}
      >
        <div className="modal-header">
          <div className="modal-title">
            <Settings size={16} />
            <span>{t.settings.title}</span>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="settings-body">
          <div className="settings-section">
            <h3 className="settings-section-title">{t.settings.sections.appearance}</h3>
            
            {/* Language Setting */}
            <div className="setting-row">
              <div className="setting-info">
                <div className="setting-label">
                  <Languages size={15} />
                  {t.settings.language}
                </div>
              </div>
              <div className="setting-controls segment-control">
                <button
                  className={`segment-btn ${locale === 'en' ? 'active' : ''}`}
                  onClick={() => setLocale('en')}
                >
                  English
                </button>
                <button
                  className={`segment-btn ${locale === 'ru' ? 'active' : ''}`}
                  onClick={() => setLocale('ru')}
                >
                  Русский
                </button>
              </div>
            </div>

            {/* Theme Setting */}
            <div className="setting-row">
              <div className="setting-info">
                <div className="setting-label">
                  <Palette size={15} />
                  {t.settings.theme}
                </div>
              </div>
              <div className="setting-controls segment-control">
                <button
                  className={`segment-btn ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => onThemeChange('dark')}
                >
                  {t.settings.themeDark}
                </button>
                <button
                  className={`segment-btn ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => onThemeChange('light')}
                >
                  {t.settings.themeLight}
                </button>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3 className="settings-section-title">{t.settings.sections.interaction}</h3>
            
            <div className="setting-row">
              <div className="setting-info">
                <div className="setting-label">
                  <Keyboard size={15} />
                  {t.settings.hotkey}
                </div>
                <div className="setting-desc">{t.settings.hotkeyHint}</div>
              </div>
              <div className="setting-controls">
                <div className="custom-select-wrap" style={{ width: '220px' }}>
                  <select
                    className="form-select-premium"
                    value={hotkey}
                    onChange={(e) => onHotkeyChange(e.target.value)}
                  >
                    {SHORTCUT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="custom-select-icon" />
                </div>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3 className="settings-section-title">{t.settings.sections.backup}</h3>
            <div className="setting-row">
              <div className="setting-info">
                <div className="setting-label">
                  <Download size={15} />
                  {t.settings.backup.exportTitle}
                </div>
                <div className="setting-desc">{t.settings.backup.exportDesc}</div>
              </div>
              <button className="copy-btn sm" onClick={onExport} style={{ width: 'auto', padding: '6px 12px' }}>
                <Download size={14} style={{ marginRight: 6 }} />
                {t.settings.backup.exportBtn}
              </button>
            </div>
            <div className="setting-row">
              <div className="setting-info">
                <div className="setting-label">
                  <Upload size={15} />
                  {t.settings.backup.importTitle}
                </div>
                <div className="setting-desc">{t.settings.backup.importDesc}</div>
              </div>
              <label 
                className="copy-btn sm" 
                style={{ width: 'auto', padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <Upload size={14} style={{ marginRight: 6 }} />
                {t.settings.backup.importBtn}
                <input type="file" accept=".json" onChange={onImport} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

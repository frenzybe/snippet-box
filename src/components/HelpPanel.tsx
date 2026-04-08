import { useLocale } from '../context/LocaleContext';

export function HelpPanel() {
  const { t } = useLocale();

  return (
    <div className="help-panel">
      <div className="help-hero">
        <div className="help-hero-icon">📦</div>
        <div>
          <div className="help-hero-title">Snippet Box</div>
          <div className="help-hero-subtitle">{t.help.subtitle}</div>
        </div>
      </div>

      <div className="help-sections">
        {t.help.docs.map((section) => (
          <div key={section.title} className="help-section">
            <div className="help-section-header">
              <span className="help-section-icon">{section.icon}</span>
              <span className="help-section-title">{section.title}</span>
            </div>
            <div className="help-items">
              {section.items.map((item) => (
                <div key={item.label} className="help-item">
                  <kbd className="help-kbd">{item.label}</kbd>
                  <span className="help-item-desc">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="help-footer">
        <span>Snippet Box v1.0.0</span>
        <span>·</span>
        <span>Tauri 2 + React + CodeMirror</span>
      </div>
    </div>
  );
}

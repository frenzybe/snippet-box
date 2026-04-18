import { useLocale } from '../context/LocaleContext';
import { usePlatform } from '../context/PlatformContext';
import { APP_NAME, APP_VERSION, TECH_STACK } from '../utils/constants';
import styles from './HelpPanel.module.css';

export function HelpPanel() {
  const { t } = useLocale();
  const { resolvePlaceholders } = usePlatform();

  return (
    <div className={styles.helpPanel}>
      <div className={styles.helpHero}>
        <div className={styles.helpHeroIcon}>📦</div>
        <div>
          <div className={styles.helpHeroTitle}>{APP_NAME}</div>
          <div className={styles.helpHeroSubtitle}>{t.help.subtitle}</div>
        </div>
      </div>

      <div className={styles.helpSections}>
        {t.help.docs.map((section) => (
          <div key={section.title} className={styles.helpSection}>
            <div className={styles.helpSectionHeader}>
              <span className={styles.helpSectionIcon}>{section.icon}</span>
              <span className={styles.helpSectionTitle}>{section.title}</span>
            </div>
            <div className={styles.helpItems}>
              {section.items.map((item) => (
                <div key={item.label} className={styles.helpItem}>
                  <kbd className={styles.helpKbd}>{resolvePlaceholders(item.label)}</kbd>
                  <span className={styles.helpItemDesc}>{resolvePlaceholders(item.desc)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.helpFooter}>
        <span>{APP_NAME} v{APP_VERSION}</span>
        <span>·</span>
        <span>{TECH_STACK}</span>
      </div>
    </div>
  );
}

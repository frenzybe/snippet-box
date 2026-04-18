import { useLocale } from '../context/LocaleContext';
import { useUIStore } from '../store/useUIStore';
import { MODAL_WIDTH, APP_VERSION } from '../utils/constants';

import { Modal } from './ui/Modal';
import { AppearanceSettings } from './Settings/components/AppearanceSettings';
import { InteractionSettings } from './Settings/components/InteractionSettings';
import { EditorSettings } from './Settings/components/EditorSettings';
import { BackupSettings } from './Settings/components/BackupSettings';

import styles from './Settings/Settings.module.css';

/**
 * Senior-level Refactored SettingsModal.
 * A clean container that composes specialized settings sections.
 */
export function SettingsModal() {
  const { t } = useLocale();
  const setSettingsOpen = useUIStore(state => state.setSettingsOpen);
  const isSettingsOpen = useUIStore(state => state.isSettingsOpen);

  const handleClose = () => setSettingsOpen(false);

  return (
    <Modal
      isOpen={isSettingsOpen}
      onClose={handleClose}
      title={t.settings.title}
      width={MODAL_WIDTH.SM}
    >
      <div className={styles.body}>
        <AppearanceSettings />
        <InteractionSettings />
        <EditorSettings />
        <BackupSettings />
      </div>
      <div className={styles.footer}>
        <span>{t.common.version || 'Version'} {APP_VERSION}</span>
      </div>
    </Modal>
  );
}

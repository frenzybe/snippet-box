import React, { useState } from 'react';
import { Download, Upload, AlertOctagon } from 'lucide-react';
import { useLocale } from '../../../context/LocaleContext';
import { useToastStore } from '../../../store/useToastStore';
import { storageService } from '../../../services/storage';
import { Button } from '../../ui/Button';
import { ConfirmModal } from '../../ui/ConfirmModal';
import styles from '../Settings.module.css';

export const BackupSettings: React.FC = () => {
  const { t } = useLocale();
  const addToast = useToastStore(state => state.addToast);

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleExport = async () => {
    try {
      const result = await storageService.exportBackup();
      if (result) addToast(t.toasts.exported, 'success');
    } catch (err) {
      addToast(t.common.error, 'error');
    }
  };

  const handleImport = async () => {
    try {
      const result = await storageService.importBackup();
      if (result.success) {
        addToast(t.toasts.imported, 'success');
        setTimeout(() => window.location.reload(), 1500);
      } else if (result.error) {
        addToast(result.error, 'error');
      }
    } catch (err) {
      addToast(t.common.error, 'error');
    }
  };

  const handleReset = () => {
    setIsResetConfirmOpen(false);
    storageService.performFactoryReset();
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{t.settings.sections.backup}</h3>

      <div className={styles.row}>
        <div className={styles.info}>
          <div className={styles.label}>
            <Download size={15} />
            {t.settings.backup.exportTitle}
          </div>
          <div className={styles.desc}>{t.settings.backup.exportDesc}</div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleExport}
          leftIcon={<Download size={14} />}
        >
          {t.settings.backup.exportBtn}
        </Button>
      </div>

      <div className={styles.row}>
        <div className={styles.info}>
          <div className={styles.label}>
            <Upload size={15} />
            {t.settings.backup.importTitle}
          </div>
          <div className={styles.desc}>{t.settings.backup.importDesc}</div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleImport}
          leftIcon={<Upload size={14} />}
        >
          {t.settings.backup.importBtn}
        </Button>
      </div>

      {/* Danger Zone */}
      <div className={styles.section} style={{ marginTop: '32px', border: 'none', padding: 0 }}>
        <h3 className={`${styles.sectionTitle} ${styles.dangerTitle}`}>{t.settings.sections.danger}</h3>
        <div className={styles.row}>
          <div className={styles.info}>
            <div className={`${styles.label} ${styles.dangerLabel}`}>
              <AlertOctagon size={15} />
              {t.settings.danger.resetTitle}
            </div>
            <div className={styles.desc}>{t.settings.danger.resetDesc}</div>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsResetConfirmOpen(true)}
            leftIcon={<AlertOctagon size={14} />}
          >
            {t.settings.danger.resetBtn}
          </Button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleReset}
        title={t.settings.danger.resetTitle}
        message={t.settings.danger.confirmMsg}
        confirmLabel={t.settings.danger.resetBtn}
        cancelLabel={t.common.cancel}
      />
    </div>
  );
};

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useLocale } from '../context/LocaleContext';

interface TemplateModalProps {
  code: string;
  onConfirm: (resolvedCode: string) => void;
  onClose: () => void;
}

function extractVars(code: string): string[] {
  const matches = [...code.matchAll(/\{\{([^}]+)\}\}/g)];
  const unique = [...new Set(matches.map(m => m[1].trim()))];
  return unique;
}

export function TemplateModal({ code, onConfirm, onClose }: TemplateModalProps) {
  const { t } = useLocale();
  const vars = extractVars(code);
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(vars.map(v => [v, '']))
  );
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let resolved = code;
    for (const [key, val] of Object.entries(values)) {
      resolved = resolved.split(`{{${key}}}`).join(val);
    }
    onConfirm(resolved);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-box"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.18 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <span className="modal-title">{t.templateModal.title}</span>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <p className="modal-hint">{t.templateModal.hint}</p>
          {vars.map((v, i) => (
            <div className="modal-field" key={v}>
              <label className="modal-label">
                <code>{`{{${v}}}`}</code>
              </label>
              <input
                ref={i === 0 ? firstInputRef : undefined}
                className="form-input"
                placeholder={`${t.templateModal.enterValue} ${v}…`}
                value={values[v]}
                onChange={e => setValues(prev => ({ ...prev, [v]: e.target.value }))}
                required
              />
            </div>
          ))}

          <button type="submit" className="copy-btn" style={{ marginTop: 16, justifyContent: 'center', padding: '10px' }}>
            <Check size={16} />
            {t.templateModal.copyClose}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

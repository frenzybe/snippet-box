import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { githubLight } from "@uiw/codemirror-theme-github";
import { hoverTooltip } from "@codemirror/view";
import { Check, Copy, Trash2, Pencil, ChevronDown, ChevronUp, GripHorizontal, Code2 } from "lucide-react";
import { Snippet } from '../types';
import { getLangExtension } from '../utils/langExtension';
import { useLocale } from '../context/LocaleContext';

interface EditorProps {
  snippet: Snippet | null;
  copied: boolean;
  onCopy: (varValues: Record<string, string>, activeFileId?: string) => void;
  onDelete: (id: string) => void;
  onEdit: (snippet: Snippet) => void;
  theme: 'dark' | 'light';
}

function extractVars(code: string): string[] {
  const matches = [...code.matchAll(/\{\{([^}]+)\}\}/g)];
  return [...new Set(matches.map(m => m[1].trim()))];
}

function resolveTemplate(code: string, values: Record<string, string>): string {
  let result = code;
  for (const [key, val] of Object.entries(values)) {
    result = result.split(`{{${key}}}`).join(val || `{{${key}}}`);
  }
  return result;
}

export function Editor({ snippet, copied, onCopy, onDelete, onEdit, theme }: EditorProps) {
  const { t } = useLocale();
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [varValues, setVarValues] = useState<Record<string, string>>({});
  const [previewOpen, setPreviewOpen] = useState(true);
  const [previewHeight, setPreviewHeight] = useState(140);
  const panelRef = useRef<HTMLDivElement>(null);       // direct DOM ref
  const dragStartY = useRef<number | null>(null);
  const dragStartH = useRef<number>(140);
  // Ref so CodeMirror extension always sees the latest values without re-creating
  const varValuesRef = useRef<Record<string, string>>({});
  const setterRef = useRef<(key: string, val: string) => void>(() => {});
  // Ref for locale strings (needed inside CodeMirror DOM closures)
  const tRef = useRef(t);

  // Ensure activeFileId is valid when snippet changes
  useEffect(() => {
    if (snippet && snippet.files.length > 0) {
      if (!activeFileId || !snippet.files.find(f => f.id === activeFileId)) {
        setActiveFileId(snippet.files[0].id);
      }
    } else {
      setActiveFileId(null);
    }
  }, [snippet, activeFileId]);

  const activeFile = useMemo(() => {
    return snippet?.files.find(f => f.id === activeFileId) || snippet?.files[0];
  }, [snippet, activeFileId]);

  const isTemplate = useMemo(
    () => !!snippet && snippet.files.some(f => f.code && /\{\{[^}]+\}\}/.test(f.code)),
    [snippet]
  );

  const templateVars = useMemo(
    () => snippet ? [...new Set(snippet.files.flatMap(f => extractVars(f.code)))] : [],
    [snippet]
  );

  // Reset vars when snippet changes
  useEffect(() => {
    const initial = Object.fromEntries(templateVars.map(v => [v, '']));
    setVarValues(initial);
    varValuesRef.current = initial;
  }, [snippet?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleVarSet = useCallback((key: string, val: string) => {
    setVarValues(prev => {
      const next = { ...prev, [key]: val };
      varValuesRef.current = next;
      return next;
    });
  }, []);

  // Keep setter ref and t ref updated
  useEffect(() => {
    setterRef.current = handleVarSet;
  }, [handleVarSet]);

  useEffect(() => {
    tRef.current = t;
  }, [t]);

  // Build hover tooltip extension — stable, uses refs for fresh data
  const varTooltipExtension = useMemo(() => {
    if (!isTemplate) return [];

    return [
      hoverTooltip((view, pos) => {
        const text = view.state.doc.toString();
        const regex = /\{\{([^}]+)\}\}/g;
        let match;

        while ((match = regex.exec(text)) !== null) {
          const start = match.index;
          const end = start + match[0].length;

          if (pos >= start && pos < end) {
            const varName = match[1].trim();

            return {
              pos: start,
              end,
              above: false,
              create() {
                const dom = document.createElement('div');
                dom.className = 'cm-var-tooltip';

                const label = document.createElement('div');
                label.className = 'cm-var-tooltip-label';
                label.textContent = `{{${varName}}}`;

                const input = document.createElement('input');
                input.className = 'cm-var-tooltip-input';
                input.placeholder = `${tRef.current.templateModal.enterValue} ${varName}…`;
                input.value = varValuesRef.current[varName] ?? '';

                input.addEventListener('input', e => {
                  const val = (e.target as HTMLInputElement).value;
                  setterRef.current(varName, val);
                });

                // Prevent CodeMirror from intercepting keystrokes inside the input
                input.addEventListener('keydown', e => e.stopPropagation());

                dom.appendChild(label);
                dom.appendChild(input);

                // Auto-focus input when tooltip shows
                requestAnimationFrame(() => input.focus());

                return { dom };
              },
            };
          }
        }

        return null;
      }, { hoverTime: 300 }),
    ];
  }, [isTemplate, snippet?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const resolvedCode = useMemo(() => {
    if (!activeFile) return '';
    if (!isTemplate) return activeFile.code;
    return resolveTemplate(activeFile.code, varValues);
  }, [activeFile, isTemplate, varValues]);

  if (!snippet) {
    return (
      <div className="editor-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: '2rem' }}>📋</span>
          <span>{t.editor.selectHint}</span>
        </div>
      </div>
    );
  }

  const allFilled = templateVars.every(v => varValues[v]?.trim());

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isTemplate && (
            <span className="template-badge">{t.template.badge}</span>
          )}
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', opacity: 0.8 }}>
            {activeFile?.language || 'TEXT'}
          </span>
        </div>
        <div className="editor-actions">
          <div className="action-group">
            <button className="icon-btn sm" onClick={() => onDelete(snippet.id)} title={t.editor.delete}>
              <Trash2 size={14} />
            </button>
            <button className="icon-btn sm" onClick={() => onEdit(snippet)} title={t.editor.edit}>
              <Pencil size={14} />
            </button>
          </div>
          <button
            className="copy-btn primary"
            onClick={() => onCopy(varValues, activeFile?.id)}
            style={isTemplate && !allFilled ? { opacity: 0.6 } : {}}
            title={isTemplate && !allFilled ? `${t.template.hint} {{variables}} ${t.template.hint2}` : t.editor.copy}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? t.editor.copied : t.editor.copy}
          </button>
        </div>
      </div>

      {/* Hint bar for template snippets */}
      {isTemplate && (
        <div className="template-hover-hint">
          💡 {t.template.hint} <code>{"{{variables}}"}</code> {t.template.hint2}
          {templateVars.length > 0 && (
            <span className="template-fill-status">
              {templateVars.filter(v => varValues[v]?.trim()).length}/{templateVars.length} {t.template.filled}
            </span>
          )}
        </div>
      )}

      {snippet.files.length > 1 && (
        <div className="file-tabs">
          {snippet.files.map(f => (
            <button
              key={f.id}
              className={`file-tab ${f.id === activeFileId ? 'active' : ''}`}
              onClick={() => setActiveFileId(f.id)}
            >
              <Code2 size={13} style={{ marginRight: 6 }} />
              {f.filename}
            </button>
          ))}
        </div>
      )}

      <div className="editor-scroll">
        <CodeMirror
          value={activeFile?.code || ''}
          theme={theme === 'dark' ? dracula : githubLight}
          extensions={[...getLangExtension(activeFile?.language || ''), ...varTooltipExtension]}
          editable={false}
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            highlightActiveLine: false
          }}
          style={{ fontSize: '14px' }}
        />
      </div>

      {/* Live preview when vars are partially/fully filled */}
      {isTemplate && Object.values(varValues).some(v => v.trim()) && (
        <div
          ref={panelRef}
          className="template-preview-panel"
          style={{ height: previewOpen ? previewHeight : undefined }}
        >

          {/* Drag handle for resize — manipulates DOM directly for 60fps */}
          {previewOpen && (
            <div
              className="preview-resize-handle"
              onMouseDown={e => {
                e.preventDefault();
                dragStartY.current = e.clientY;
                dragStartH.current = previewHeight;

                // Disable CSS transition during drag
                if (panelRef.current) panelRef.current.style.transition = 'none';

                const onMove = (mv: MouseEvent) => {
                  if (dragStartY.current === null || !panelRef.current) return;
                  const delta = dragStartY.current - mv.clientY;
                  const next = Math.max(60, Math.min(400, dragStartH.current + delta));
                  // Mutate DOM directly — no React re-render
                  panelRef.current.style.height = `${next}px`;
                  dragStartH.current = next;           // keep start in sync
                  dragStartY.current = mv.clientY;     // incremental delta
                };

                const onUp = () => {
                  dragStartY.current = null;
                  // Read final height from DOM and commit to React state
                  if (panelRef.current) {
                    const finalH = parseInt(panelRef.current.style.height) || previewHeight;
                    panelRef.current.style.transition = '';  // restore
                    setPreviewHeight(finalH);
                  }
                  window.removeEventListener('mousemove', onMove);
                  window.removeEventListener('mouseup', onUp);
                };

                window.addEventListener('mousemove', onMove);
                window.addEventListener('mouseup', onUp);
              }}
            >
              <GripHorizontal size={14} />
            </div>
          )}

          {/* Header row with label + toggle */}
          <div className="preview-header">
            <span className="template-preview-label">{t.template.preview}</span>
            <button
              className="icon-btn preview-toggle-btn"
              onClick={() => setPreviewOpen(o => !o)}
              title={previewOpen ? 'Hide preview' : 'Show preview'}
            >
              {previewOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>

          {previewOpen && (
            <pre className="template-preview-code">{resolvedCode}</pre>
          )}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { githubLight } from "@uiw/codemirror-theme-github";
import { invoke } from "@tauri-apps/api/core";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { useLocale } from '../context/LocaleContext';
import { useSnippetStore } from "../store/useSnippetStore";
import { useUIStore } from "../store/useUIStore";
import { useSettingsStore } from "../store/useSettingsStore";
import { useToastStore } from "../store/useToastStore";

import { useEditorExtensions } from '../hooks/useEditorExtensions';
import { useTemplateVariables } from '../hooks/useTemplateVariables';

import { EditorHeader } from './Editor/EditorHeader';
import { FileTabs } from './Editor/FileTabs';
import { VariableInputs } from './Editor/VariableInputs';
import { PreviewPanel } from './Editor/PreviewPanel';
import { ConfirmModal } from './ui/ConfirmModal';
import { ExportModal } from './ExportModal';
import styles from './Editor/Editor.module.css';

export function Editor() {
  const { t } = useLocale();
  const addToast = useToastStore(state => state.addToast);
  
  const { 
    theme, lineWrapping, hideOnCopy, fontSize, 
    showLineNumbers, tabSize, highlightActiveLine 
  } = useSettingsStore();

  const snippet = useSnippetStore(state =>
    state.snippets.find(s => s.id === state.selectedId) || null
  );
  const deleteSnippet = useSnippetStore(state => state.deleteSnippet);
  
  const { setFormOpen, setEditingSnippetId } = useUIStore();
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const activeFile = useMemo(() => {
    return snippet?.files.find(f => f.id === activeFileId) || snippet?.files[0];
  }, [snippet, activeFileId]);

  const {
    templateVars, varValues, isTemplate, allFilled,
    handleVarChange, resolveSnippetCode
  } = useTemplateVariables(snippet);

  const extensions = useEditorExtensions({
    fontSize, tabSize, lineWrapping,
    language: activeFile?.language || 'text'
  });

  useEffect(() => {
    if (snippet && snippet.files.length > 0) {
      if (!activeFileId || !snippet.files.find(f => f.id === activeFileId)) {
        setActiveFileId(snippet.files[0].id);
      }
    } else {
      setActiveFileId(null);
    }
    setIsPreviewActive(false);
  }, [snippet?.id]);

  const handleCopy = () => {
    if (!activeFile) return;
    const textToCopy = resolveSnippetCode(activeFile.code);

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    addToast(t.toasts.copied, 'success');

    setTimeout(() => {
      setCopied(false);
      if (hideOnCopy) invoke('hide_app');
    }, 600);
  };

  if (!snippet) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>📋</span>
          <span>{t.editor.selectHint}</span>
        </div>
      </div>
    );
  }

  const isMarkdown = activeFile?.language?.toLowerCase() === 'markdown';

  return (
    <div className={styles.container}>
      <EditorHeader
        title={snippet.title}
        language={activeFile?.language || 'TEXT'}
        isTemplate={isTemplate}
        onDelete={() => setIsDeleteConfirmOpen(true)}
        onEdit={() => {
          setEditingSnippetId(snippet.id);
          setFormOpen(true);
        }}
        onCopy={handleCopy}
        copied={copied}
        copyDisabled={isTemplate && !allFilled}
        copyTitle={isTemplate && !allFilled ? `${t.template.hint} {{variables}} ${t.template.hint2}` : t.editor.copy}
        t={t}
        showPreviewToggle={isMarkdown}
        isPreviewActive={isPreviewActive}
        onTogglePreview={() => setIsPreviewActive(!isPreviewActive)}
        onExport={() => setIsExportModalOpen(true)}
      />

      {isExportModalOpen && (
        <ExportModal 
          snippet={snippet}
          varValues={varValues}
          initialFileId={activeFileId || undefined}
          onClose={() => setIsExportModalOpen(false)} 
        />
      )}

      <VariableInputs
        vars={templateVars}
        values={varValues}
        onChange={handleVarChange}
        placeholder={t.templateModal.enterValue}
      />

      <FileTabs
        files={snippet.files}
        activeFileId={activeFileId}
        onSelect={setActiveFileId}
      />

      <div className={styles.scrollArea}>
        {isMarkdown && isPreviewActive ? (
          <div className={styles.markdownContent}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{activeFile?.code || ''}</ReactMarkdown>
          </div>
        ) : (
          <CodeMirror
            value={activeFile?.code || ''}
            theme={theme === 'light' ? githubLight : dracula}
            indentWithTab={false}
            basicSetup={{
              lineNumbers: showLineNumbers,
              foldGutter: true,
              highlightActiveLine: highlightActiveLine,
              dropCursor: false,
              indentOnInput: false,
            }}
            extensions={extensions}
            editable={false}
            height="100%"
          />
        )}
      </div>

      {isTemplate && Object.values(varValues).some(v => v.trim()) && (
        <PreviewPanel
          isOpen={previewOpen}
          onToggle={() => setPreviewOpen(!previewOpen)}
          code={resolveSnippetCode(activeFile?.code || '')}
          label={t.template.preview}
          isMarkdown={isMarkdown}
        />
      )}

      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => {
          setIsDeleteConfirmOpen(false);
          deleteSnippet(snippet.id);
          addToast(t.toasts.deleted, 'info');
        }}
        title={t.editor.delete}
        message={t.settings.danger.confirmMsg}
        confirmLabel={t.editor.delete}
        cancelLabel={t.common.cancel}
      />
    </div>
  );
}

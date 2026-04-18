import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import CodeMirror from '@uiw/react-codemirror';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { githubLight } from '@uiw/codemirror-theme-github';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { indentUnit } from '@codemirror/language';
import { GitCompare } from 'lucide-react';

import { Snippet, SnippetFile, SUPPORTED_LANGUAGES } from '../types';
import { getLangExtension } from '../utils/langExtension';
import { useLocale } from '../context/LocaleContext';

import { useSnippetStore } from '../store/useSnippetStore';
import { useUIStore } from '../store/useUIStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useToastStore } from '../store/useToastStore';

import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { TagManager } from './SnippetForm/TagManager';
import { FileTabList } from './SnippetForm/FileTabList';
import { DiffViewer } from './Editor/DiffViewer';
import styles from './SnippetForm/SnippetForm.module.css';

export function SnippetForm() {
  const { t } = useLocale();
  const theme = useSettingsStore(state => state.theme);
  const isFormOpen = useUIStore(state => state.isFormOpen);
  const setFormOpen = useUIStore(state => state.setFormOpen);
  const editingSnippetId = useUIStore(state => state.editingSnippetId);
  const setEditingSnippetId = useUIStore(state => state.setEditingSnippetId);

  const editingSnippet = useSnippetStore(state =>
    state.snippets.find(s => s.id === editingSnippetId) || null
  );

  const originalFiles = React.useMemo(() => {
    return editingSnippet ? JSON.parse(JSON.stringify(editingSnippet.files)) as SnippetFile[] : null;
  }, [editingSnippet?.id]);

  const addToast = useToastStore(state => state.addToast);
  const lineWrapping = useSettingsStore(state => state.lineWrapping);
  const fontSize = useSettingsStore(state => state.fontSize);
  const showLineNumbers = useSettingsStore(state => state.showLineNumbers);
  const tabSize = useSettingsStore(state => state.tabSize);
  const highlightActiveLine = useSettingsStore(state => state.highlightActiveLine);
  const addSnippet = useSnippetStore(state => state.addSnippet);
  const updateSnippet = useSnippetStore(state => state.updateSnippet);

  const [title, setTitle] = useState(editingSnippet?.title ?? '');
  const [tags, setTags] = useState<string[]>(editingSnippet?.tags ?? []);
  const [files, setFiles] = useState<SnippetFile[]>(
    editingSnippet?.files ?? [{ id: uuidv4(), filename: 'main', code: '', language: 'javascript' }]
  );
  const [activeFileId, setActiveFileId] = useState<string>(files[0].id);
  const [showDiff, setShowDiff] = useState(false);

  const fontSizeExtension = React.useMemo(() => {
    return EditorView.theme({
      ".cm-content, .cm-gutters": {
        fontSize: `${fontSize}px`,
      },
      ".cm-scroller": {
        fontFamily: 'var(--font-mono)',
      }
    });
  }, [fontSize]);

  const tabSizeExtension = React.useMemo(() => {
    return [
      indentUnit.of(" ".repeat(tabSize)),
      EditorState.tabSize.of(tabSize)
    ];
  }, [tabSize]);

  const handleClose = () => {
    setFormOpen(false);
    setEditingSnippetId(null);
  };

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  const updateFileAt = (id: string, updates: Partial<SnippetFile>) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const addFile = () => {
    const newFile: SnippetFile = {
      id: uuidv4(),
      filename: `file_${files.length + 1}`,
      code: '',
      language: 'javascript'
    };
    setFiles([...files, newFile]);
    setActiveFileId(newFile.id);
  };

  const removeFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (files.length <= 1) return;
    const newFiles = files.filter((f) => f.id !== id);
    setFiles(newFiles);
    if (activeFileId === id) {
      setActiveFileId(newFiles[0].id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      addToast(t.toasts.fillTitle, 'error');
      return;
    }

    if (files.some(f => !f.filename.trim())) {
      addToast(t.toasts.fillFilename, 'error');
      return;
    }

    if (files.some(f => !f.code.trim())) {
      addToast(t.toasts.fillCode, 'error');
      return;
    }

    const snippet: Snippet = {
      id: editingSnippet?.id ?? uuidv4(),
      title,
      files,
      tags,
      isFavorite: editingSnippet?.isFavorite ?? false,
      createdAt: editingSnippet?.createdAt ?? Date.now(),
      updatedAt: Date.now()
    };

    if (editingSnippet) {
      updateSnippet(snippet);
    } else {
      addSnippet(snippet);
    }
    handleClose();
  };

  return (
    <Modal
      isOpen={isFormOpen}
      onClose={handleClose}
      title={editingSnippet ? t.editor.edit : t.snippetForm.title}
      width="900px"
      padding={false}
      scrollable={false}
    >
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.workspace}>
          <div className={styles.metaSide}>
            <Input
              label={t.snippetForm.titleLabel}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.snippetForm.titlePlaceholder}
              autoFocus
              required
            />

            <TagManager
              label={t.snippetForm.tagsLabel}
              tags={tags}
              onAdd={(tag) => setTags([...tags, tag])}
              onRemove={(tag) => setTags(tags.filter(t => t !== tag))}
            />

            <div className={styles.fileOptionsGrid}>
              <Input
                label={t.snippetForm.filenameLabel}
                value={activeFile.filename}
                onChange={(e) => updateFileAt(activeFile.id, { filename: e.target.value })}
                className={styles.filenameInput}
                size="sm"
              />

              <Select
                label={t.snippetForm.languageLabel}
                value={activeFile.language}
                options={SUPPORTED_LANGUAGES}
                onChange={(e) => updateFileAt(activeFile.id, { language: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.mainSide}>
            <FileTabList
              files={files}
              activeFileId={activeFileId}
              onSelect={setActiveFileId}
              onAdd={addFile}
              onRemove={removeFile}
            />

            <div className={styles.editorContainer}>
              {showDiff && originalFiles ? (
                <DiffViewer
                  oldText={originalFiles.find(f => f.id === activeFileId)?.code || ''}
                  newText={activeFile.code}
                />
              ) : (
                <CodeMirror
                  value={activeFile.code}
                  height="100%"
                  className={styles.codeEditor}
                  theme={theme === 'dark' || theme === 'dracula' || theme === 'nord' || theme === 'onedark' ? dracula : githubLight}
                  indentWithTab={false}
                  extensions={[
                    ...getLangExtension(activeFile.language),
                    ...(lineWrapping ? [EditorView.lineWrapping] : []),
                    fontSizeExtension,
                    tabSizeExtension
                  ]}
                  onChange={(val) => updateFileAt(activeFile.id, { code: val })}
                  basicSetup={{
                    lineNumbers: showLineNumbers,
                    foldGutter: true,
                    highlightActiveLine: highlightActiveLine,
                    dropCursor: false,
                    indentOnInput: false,
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            {editingSnippet && (
              <Button
                variant={showDiff ? "secondary" : "ghost"}
                onClick={(e) => {
                  e.preventDefault();
                  setShowDiff(!showDiff);
                }}
                leftIcon={<GitCompare size={14} />}
              >
                {showDiff ? t.common.edit : t.common.diffPreview}
              </Button>
            )}
          </div>
          <div className={styles.footerRight}>
            <Button variant="ghost" onClick={handleClose}>
              {t.common.cancel}
            </Button>
            <Button variant="primary" type="submit">
              {t.common.save}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

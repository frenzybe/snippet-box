import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Plus, Code2, FileText, Info, Trash2, ChevronDown, Hash } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import CodeMirror from '@uiw/react-codemirror';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { githubLight } from '@uiw/codemirror-theme-github';
import { Snippet, SnippetFile, SUPPORTED_LANGUAGES } from '../types';
import { getLangExtension } from '../utils/langExtension';
import { useLocale } from '../context/LocaleContext';

interface SnippetFormProps {
  onAdd: (snippet: Snippet) => void;
  onEdit?: (snippet: Snippet) => void;
  onClose: () => void;
  theme: 'dark' | 'light';
  editingSnippet?: Snippet | null;
}

export function SnippetForm({ onAdd, onEdit, onClose, theme, editingSnippet }: SnippetFormProps) {
  const { t } = useLocale();
  const isEditing = !!editingSnippet;

  const [title, setTitle] = useState(editingSnippet?.title ?? '');
  const [tags, setTags] = useState<string[]>(editingSnippet?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [files, setFiles] = useState<SnippetFile[]>(
    editingSnippet?.files ?? [{ id: uuidv4(), filename: 'main', code: '', language: 'javascript' }]
  );
  const [activeFileId, setActiveFileId] = useState<string>(files[0].id);

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

  const addTag = () => {
    const val = tagInput.trim().toLowerCase();
    if (val && !tags.includes(val)) {
      setTags([...tags, val]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleTagKeydown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || files.some(f => !f.code || !f.filename)) return;

    const hasVars = files.some(f => /\{\{[^}]+\}\}/.test(f.code));
    const snippet: Snippet = {
      id: editingSnippet?.id ?? uuidv4(),
      title,
      files,
      tags,
      isFavorite: editingSnippet?.isFavorite ?? false,
      isTemplate: hasVars,
    };

    if (isEditing && onEdit) {
      onEdit(snippet);
    } else {
      onAdd(snippet);
    }
  };

  const allVars = [...new Set(files.flatMap(f => [...f.code.matchAll(/\{\{([^}]+)\}\}/g)].map(m => m[1])))];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-box"
        style={{ 
          width: '90vw', 
          maxWidth: '1100px', 
          height: '85vh', 
          display: 'flex', 
          flexDirection: 'column' 
        }}
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FileText size={18} className="accent-text" />
            <span className="modal-title">{isEditing ? t.form.editTitle : t.form.newTitle}</span>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Top File Tabs */}
        <div className="form-tabs-bar">
          {files.map((file) => (
            <div
              key={file.id}
              className={`form-file-tab ${file.id === activeFileId ? 'active' : ''}`}
              onClick={() => setActiveFileId(file.id)}
            >
              <Code2 size={14} />
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {file.filename}
              </span>
              {files.length > 1 && (
                <button
                  type="button"
                  className="trash-btn"
                  onClick={(e) => removeFile(file.id, e)}
                  title={t.form.deleteFile}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
          <button type="button" className="icon-btn" onClick={addFile} style={{ marginLeft: 8 }} title={t.form.addFile}>
            <Plus size={18} />
          </button>
        </div>

        <div className="form-workspace">
          {/* Left Metadata Side */}
          <div className="form-metaside">
            <div className="form-section">
              <label className="form-label">{t.form.titlePlaceholder.split(' (')[0]}</label>
              <input
                autoFocus
                className="form-input"
                placeholder={t.form.titlePlaceholder}
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-section">
              <label className="form-label">Tags</label>
              <div className="tags-input-container">
                <AnimatePresence>
                  {tags.map(tag => (
                    <motion.div
                      key={tag}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="tag-chip"
                    >
                      <Hash size={10} style={{ opacity: 0.6 }} />
                      <span>{tag}</span>
                      <div className="tag-chip-remove" onClick={() => removeTag(tag)}>
                        <X size={12} />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <input
                  className="tag-bare-input"
                  placeholder={tags.length === 0 ? t.form.tagsPlaceholder : ""}
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeydown}
                  onBlur={addTag}
                />
              </div>
            </div>

            <div style={{ margin: '8px 0', height: '1px', background: 'var(--border-color)' }} />

            <div className="form-section">
              <label className="form-label">{t.form.filename}</label>
              <input
                className="form-input"
                value={activeFile.filename}
                onChange={e => updateFileAt(activeFile.id, { filename: e.target.value })}
              />
            </div>

            <div className="form-section">
              <label className="form-label">{t.editor.language}</label>
              <div className="custom-select-wrap">
                <select
                  className="form-select-premium"
                  value={activeFile.language}
                  onChange={e => updateFileAt(activeFile.id, { language: e.target.value })}
                >
                  {SUPPORTED_LANGUAGES.map(l => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="custom-select-icon" />
              </div>
            </div>

            {allVars.length > 0 && (
              <div className="template-hint" style={{ marginTop: 'auto' }}>
                <Info size={14} style={{ marginRight: 6 }} />
                <div style={{ fontSize: '0.75rem' }}>
                  {t.form.templateDetected} <strong>{allVars.map(v => `{{${v}}}`).join(', ')}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Right Editor Area */}
          <div className="form-editor-main">
            <div className="code-editor-wrap" style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: 12, overflow: 'hidden' }}>
              <CodeMirror
                value={activeFile.code}
                height="100%"
                theme={theme === 'dark' ? dracula : githubLight}
                extensions={getLangExtension(activeFile.language || 'text')}
                onChange={val => updateFileAt(activeFile.id, { code: val })}
                placeholder={t.form.codePlaceholder}
                basicSetup={{
                  lineNumbers: true,
                  highlightActiveLine: true,
                  foldGutter: false,
                }}
                style={{ fontSize: 13, height: '100%' }}
              />
            </div>
          </div>
        </div>

        <div className="form-footer">
          <button
            type="button"
            className="copy-btn primary"
            style={{ width: 'auto', minWidth: '160px', height: '42px' }}
            onClick={handleSubmit}
          >
            <Save size={18} />
            {isEditing ? t.form.saveChanges : t.form.save}
          </button>
        </div>
      </motion.div>
    </div>
  );
}



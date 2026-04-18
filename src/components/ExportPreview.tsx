import React, { forwardRef } from 'react';
import ReactCodeMirror from '@uiw/react-codemirror';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { SnippetFile } from '../types';
import { resolveTemplate } from '../utils/template';
import { getLangExtension } from '../utils/langExtension';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './ExportPreview.module.css';
interface ExportPreviewProps {
  file: SnippetFile;
  gradient: string;
  padding: string;
  theme: Extension;
  showControls: boolean;
  fontSize: number;
  lineNumbers: boolean;
  lineWrapping: boolean;
  fontFamily: string;
  shadowOpacity?: number;
  cornerRadius?: number;
  varValues?: Record<string, string>;
  isGlass?: boolean;
  renderMarkdown?: boolean;
}

export const ExportPreview = forwardRef<HTMLDivElement, ExportPreviewProps>(({
  file,
  gradient,
  padding,
  theme,
  showControls,
  fontSize,
  lineNumbers,
  lineWrapping,
  fontFamily,
  shadowOpacity = 0.4,
  cornerRadius = 12,
  varValues,
  isGlass = false,
  renderMarkdown = false
}, ref) => {

  const extensions = React.useMemo(() => {
    const ext = Array.isArray(theme) ? [...theme] : [theme];
    if (lineWrapping) {
      ext.push(EditorView.lineWrapping);
    }
    ext.push(...getLangExtension(file.language));
    return ext;
  }, [theme, lineWrapping, file.language]);

  const resolvedCode = React.useMemo(() => {
    if (!varValues) return file.code;
    return resolveTemplate(file.code, varValues);
  }, [file, varValues]);

  return (
    <div
      ref={ref}
      className={styles.container}
      style={{
        background: gradient,
        padding: padding
      }}
    >
      <div
        className={`${styles.window} ${isGlass ? styles.glassWindow : ''}`}
        style={{
          borderRadius: `${cornerRadius}px`,
          boxShadow: `0 ${20 + shadowOpacity * 40}px ${50 + shadowOpacity * 60}px rgba(0,0,0, ${0.4 + shadowOpacity * 0.4})`
        }}
      >
        {showControls && (
          <div className={styles.header}>
            <div className={styles.dots}>
              <span className={styles.dot} style={{ background: '#ff5f56' }} />
              <span className={styles.dot} style={{ background: '#ffbd2e' }} />
              <span className={styles.dot} style={{ background: '#27c93f' }} />
            </div>
            <div className={styles.title}>{file.filename}</div>
          </div>
        )}
        <div
          className={`${styles.editorWrap} ${isGlass ? styles.glassEditor : ''}`}
          style={{
            fontSize: `${fontSize}px`,
            fontFamily: fontFamily,
            borderBottomLeftRadius: `${cornerRadius}px`,
            borderBottomRightRadius: `${cornerRadius}px`,
            overflow: 'hidden'
          }}
        >
          {renderMarkdown && file.language === 'markdown' ? (
            <div className={styles.markdownContent}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{resolvedCode}</ReactMarkdown>
            </div>
          ) : (
            <ReactCodeMirror
              value={resolvedCode}
              theme={theme}
              extensions={extensions}
              basicSetup={{
                lineNumbers: lineNumbers,
                foldGutter: false,
                highlightActiveLine: false,
                syntaxHighlighting: true,
              }}
              editable={false}
            />
          )}
        </div>
      </div>
    </div>
  );
});

ExportPreview.displayName = 'ExportPreview';

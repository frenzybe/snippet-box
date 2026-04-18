import React, { useRef, useState } from 'react';
import { ChevronDown, ChevronUp, GripHorizontal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { IconButton } from '../ui/IconButton';
import styles from './Editor.module.css';

interface PreviewPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  code: string;
  label: string;
  initialHeight?: number;
  isMarkdown?: boolean;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  isOpen,
  onToggle,
  code,
  label,
  initialHeight = 140,
  isMarkdown = false
}) => {
  const [height, setHeight] = useState(initialHeight);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);
  const dragStartH = useRef<number>(initialHeight);

  const startDragging = (e: React.MouseEvent) => {
    e.preventDefault();
    dragStartY.current = e.clientY;
    dragStartH.current = height;

    if (panelRef.current) panelRef.current.style.transition = 'none';

    const onMove = (mv: MouseEvent) => {
      if (dragStartY.current === null || !panelRef.current) return;
      const delta = dragStartY.current - mv.clientY;
      const next = Math.max(60, Math.min(400, dragStartH.current + delta));
      panelRef.current.style.height = `${next}px`;
      dragStartH.current = next;
      dragStartY.current = mv.clientY;
    };

    const onUp = () => {
      dragStartY.current = null;
      if (panelRef.current) {
        const finalH = parseInt(panelRef.current.style.height) || height;
        panelRef.current.style.transition = '';
        setHeight(finalH);
      }
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div
      ref={panelRef}
      className={styles.previewPanel}
      style={{ height: isOpen ? height : undefined }}
    >
      {isOpen && (
        <div className={styles.resizeHandle} onMouseDown={startDragging}>
          <GripHorizontal size={14} />
        </div>
      )}

      <div className={styles.previewHeader}>
        <span className={styles.previewLabel}>{label}</span>
        <IconButton
          icon={isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          onClick={onToggle}
          title={isOpen ? 'Hide preview' : 'Show preview'}
          size="sm"
          className={styles.previewToggleBtn}
        />
      </div>

      {isOpen && (
        <div className={isMarkdown ? styles.markdownContent : styles.previewCode}>
          {isMarkdown ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{code}</ReactMarkdown>
          ) : (
            <pre style={{ margin: 0, whiteSpace: 'inherit' }}>{code}</pre>
          )}
        </div>
      )}
    </div>
  );
};

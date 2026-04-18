import React, { useMemo } from 'react';
import styles from './DiffViewer.module.css';

interface DiffViewerProps {
  oldText: string;
  newText: string;
  language?: string;
}

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  oldLineNum?: number;
  newLineNum?: number;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ oldText, newText }) => {
  const diffLines = useMemo(() => {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');

    const result: DiffLine[] = [];
    let i = 0; // old
    let j = 0; // new

    while (i < oldLines.length || j < newLines.length) {
      if (i < oldLines.length && j < newLines.length && oldLines[i] === newLines[j]) {
        result.push({ type: 'unchanged', content: oldLines[i], oldLineNum: i + 1, newLineNum: j + 1 });
        i++;
        j++;
      } else {
        // Find if this old line exists ahead in new lines (it's a removal + additions)
        // or if this new line exists ahead in old lines (it's an addition)

        // Simulating a simple diff: remove then add
        if (i < oldLines.length) {
          result.push({ type: 'removed', content: oldLines[i], oldLineNum: i + 1 });
          i++;
        }
        if (j < newLines.length) {
          // This is a bit naive but shows changes clearly
          // In a real app we'd use 'diff' library, but here we build a visual representation
        }
      }
    }

    // Better simple diff: identify what was added vs removed more cleanly
    // Let's use a standard simple line-by-line comparison for now to show the concept
    const finalResult: DiffLine[] = [];
    const max = Math.max(oldLines.length, newLines.length);

    for (let k = 0; k < max; k++) {
      const oldLine = oldLines[k];
      const newLine = newLines[k];

      if (oldLine === newLine) {
        finalResult.push({ type: 'unchanged', content: oldLine || '', oldLineNum: k + 1, newLineNum: k + 1 });
      } else {
        if (oldLine !== undefined) {
          finalResult.push({ type: 'removed', content: oldLine, oldLineNum: k + 1 });
        }
        if (newLine !== undefined) {
          finalResult.push({ type: 'added', content: newLine, newLineNum: k + 1 });
        }
      }
    }

    return finalResult;
  }, [oldText, newText]);

  return (
    <div className={styles.container}>
      <div className={styles.gutter}>
        {diffLines.map((line, idx) => (
          <div key={idx} className={`${styles.lineNum} ${styles[line.type + 'Num']}`}>
            {line.oldLineNum || ''}
          </div>
        ))}
      </div>
      <div className={styles.gutter}>
        {diffLines.map((line, idx) => (
          <div key={idx} className={`${styles.lineNum} ${styles[line.type + 'Num']}`}>
            {line.newLineNum || ''}
          </div>
        ))}
      </div>
      <div className={styles.content}>
        {diffLines.map((line, idx) => (
          <div key={idx} className={`${styles.line} ${styles[line.type]}`}>
            <span className={styles.marker}>
              {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
            </span>
            <pre className={styles.code}>{line.content || ' '}</pre>
          </div>
        ))}
      </div>
    </div>
  );
};

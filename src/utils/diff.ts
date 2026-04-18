export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged' | 'empty';
  content: string;
  lineNumber?: number;
}

export interface SplitDiffRow {
  left: DiffLine;
  right: DiffLine;
}

/**
 * Computes a classic LCS-based diff and returns rows formatted for a Split (Side-by-Side) view.
 */
export function computeSplitDiff(oldText: string, newText: string): SplitDiffRow[] {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  
  const m = oldLines.length;
  const n = newLines.length;
  
  // 1. Build LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  // 2. Reconstruct path and create rows
  const rows: SplitDiffRow[] = [];
  let i = m;
  let j = n;
  
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      // Unchanged
      rows.unshift({
        left: { type: 'unchanged', content: oldLines[i - 1], lineNumber: i },
        right: { type: 'unchanged', content: newLines[j - 1], lineNumber: j }
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      // Added (Right side only)
      rows.unshift({
        left: { type: 'empty', content: '' },
        right: { type: 'added', content: newLines[j - 1], lineNumber: j }
      });
      j--;
    } else {
      // Removed (Left side only)
      rows.unshift({
        left: { type: 'removed', content: oldLines[i - 1], lineNumber: i },
        right: { type: 'empty', content: '' }
      });
      i--;
    }
  }
  
  return rows;
}

import React from 'react';

/**
 * A ultra-lightweight syntax highlighter for the Diff view.
 * It uses simple Regex to wrap keywords and symbols in colored spans.
 */
export function highlightCode(code: string, _language?: string): React.ReactNode[] {
  if (!code) return [code];

  // Patterns for typical programming constructs
  const patterns = [
    // Comments
    { type: 'comment', regex: /(\/\/.*|\/\*[\s\S]*?\*\/)/g },
    // Strings
    { type: 'string', regex: /(['"`])(?:(?=(\\?))\2.)*?\1/g },
    // Keywords
    { type: 'keyword', regex: /\b(export|import|from|const|let|var|function|async|await|return|if|else|for|while|switch|case|break|continue|try|catch|finally|throw|class|extends|interface|type|public|private|protected|readonly|static|get|set|new|instanceof|typeof|void|null|undefined|true|false|boolean|number|string|any)\b/g },
    // Numbers
    { type: 'number', regex: /\b(\d+\.?\d*)\b/g },
    // Brackets
    { type: 'bracket', regex: /([{}()[\]])/g },
  ];

  // Interleave text and highlighted parts
  let segments: { text: string; type?: string }[] = [{ text: code }];

  for (const p of patterns) {
    const nextSegments: typeof segments = [];
    for (const seg of segments) {
      if (seg.type) {
        nextSegments.push(seg);
        continue;
      }

      let lastIndex = 0;
      let match;
      const regex = new RegExp(p.regex);
      
      while ((match = regex.exec(seg.text)) !== null) {
        if (match.index > lastIndex) {
          nextSegments.push({ text: seg.text.substring(lastIndex, match.index) });
        }
        nextSegments.push({ text: match[0], type: p.type });
        lastIndex = regex.lastIndex;
      }

      if (lastIndex < seg.text.length) {
        nextSegments.push({ text: seg.text.substring(lastIndex) });
      }
    }
    segments = nextSegments;
  }

  // Convert to React nodes
  return segments.map((seg, i) => (
    seg.type ? (
      <span key={i} className={`syntax-${seg.type}`}>{seg.text}</span>
    ) : (
      seg.text
    )
  ));
}

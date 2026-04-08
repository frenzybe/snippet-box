import React, { useMemo } from 'react';
import { motion, LayoutGroup, AnimatePresence } from 'framer-motion';
import { Code2, Terminal, FileCode, Files, Star } from 'lucide-react';
import { Snippet } from '../types';

interface SidebarProps {
  snippets: Snippet[];
  selectedId: string | null;
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
  onToggleFavorite: (id: string) => void;
}

export function Sidebar({ snippets, selectedId, setSelectedId, onToggleFavorite }: SidebarProps) {

  const getLangIcon = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'bash':
      case 'shell':
        return <Terminal size={14} />;
      case 'html':
      case 'xml':
        return <Code2 size={14} />;
      default:
        return <FileCode size={14} />;
    }
  };

  // Only sort by title, ignoring favorite status for ordering
  const sortedSnippets = useMemo(() => {
    return [...snippets].sort((a, b) => a.title.localeCompare(b.title));
  }, [snippets]);

  if (snippets.length === 0) {
    return null;
  }

  return (
    <div className="snippet-list">
      <LayoutGroup>
        <AnimatePresence initial={false} mode="popLayout">
          {sortedSnippets.map((snippet) => (
            <motion.div
              layout
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
              transition={{ 
                layout: { type: "spring", stiffness: 450, damping: 40 },
                opacity: { duration: 0.15 }
              }}
              key={snippet.id}
              className={`snippet-item ${selectedId === snippet.id ? 'active' : ''}`}
              onClick={() => setSelectedId(snippet.id)}
            >
              <div className="snippet-item-main">
                <div className="snippet-icon-wrap">
                  {getLangIcon(snippet.files[0]?.language || 'text')}
                </div>
                <div className="snippet-info">
                  <div className="snippet-title">{snippet.title}</div>
                  <div className="snippet-meta">
                    {snippet.files.length > 1 && (
                      <div className="file-count-badge">
                        <Files size={10} />
                        <span>{snippet.files.length}</span>
                      </div>
                    )}
                    {snippet.tags.length > 0 && (
                      <div className="snippet-tags">
                        {snippet.tags.map((t) => (
                          <span key={t} className="tag">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  className={`star-btn ${snippet.isFavorite ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(snippet.id);
                  }}
                >
                  <Star size={14} fill={snippet.isFavorite ? "currentColor" : "none"} />
                </button>
              </div>
              {selectedId === snippet.id && (
                <motion.div 
                  layoutId="active-pill"
                  className="active-indicator" 
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  );
}

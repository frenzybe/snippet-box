import { useState, useMemo, useEffect, useRef } from "react";
import { Search, Plus, HelpCircle, Code2, Settings } from "lucide-react";
import { load, Store } from "@tauri-apps/plugin-store";
import { getCurrentWindow } from '@tauri-apps/api/window';
import { invoke } from '@tauri-apps/api/core';
import { motion, AnimatePresence } from 'framer-motion';

import "./App.css";
import { Snippet, AppSettings } from "./types";
import { Sidebar } from "./components/Sidebar";
import { Editor } from "./components/Editor";
import { SnippetForm } from "./components/SnippetForm";
import { TagFilter } from "./components/TagFilter";
import { HelpPanel } from "./components/HelpPanel";
import { SettingsModal } from "./components/SettingsModal";
import { LocaleProvider, useLocale } from "./context/LocaleContext";
import { EmptyState } from "./components/EmptyState";
import { Library, SearchX, Star as StarIcon, X } from "lucide-react";

const MOCK_SNIPPETS: Snippet[] = [
  {
    id: '1',
    title: 'React Functional Component',
    files: [
      {
        id: 'file1',
        filename: 'Component.tsx',
        code: "import React from 'react';\n\nconst {{ComponentName}} = () => {\n  return (\n    <div>\n      <h1>{{Title}}</h1>\n    </div>\n  );\n};\n\nexport default {{ComponentName}};",
        language: 'jsx',
      }
    ],
    tags: ['react', 'component'],
    isTemplate: true,
  },
  {
    id: '2',
    title: 'Docker Clean',
    files: [{ id: 'f2', filename: 'clean.sh', code: "docker system prune -a --volumes", language: 'bash' }],
    tags: ['docker', 'cli'],
  },
  {
    id: '3',
    title: 'Git Reset Hard',
    files: [{ id: 'f3', filename: 'reset.sh', code: "git reset --hard HEAD\ngit clean -fd", language: 'bash' }],
    tags: ['git', 'fix'],
  },
  {
    id: '4',
    title: 'Python HTTP Server',
    files: [{ id: 'f4', filename: 'server.sh', code: "python3 -m http.server {{port}}", language: 'bash' }],
    tags: ['python', 'cli'],
    isTemplate: true,
  },
  {
    id: '5',
    title: 'Glassmorphism Card Component',
    files: [
      {
        id: 'glass-1',
        filename: 'GlassCard.tsx',
        language: 'jsx',
        code: "import React from 'react';\nimport styles from './GlassCard.module.css';\n\nconst GlassCard = ({ title, children }) => {\n  return (\n    <div className={styles.card}>\n      <h2 className={styles.title}>{{title}}</h2>\n      <div className={styles.content}>\n        {children || '{{description}}'}\n      </div>\n    </div>\n  );\n};"
      },
      {
        id: 'glass-2',
        filename: 'GlassCard.module.css',
        language: 'css',
        code: ".card {\n  backdrop-filter: blur({{blurAmount}}px);\n  background: rgba(255, 255, 255, 0.1);\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  border-radius: 16px;\n  padding: 24px;\n  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);\n}\n\n.title {\n  color: #fff;\n  margin: 0 0 12px 0;\n  font-size: 1.5rem;\n}"
      }
    ],
    tags: ['ui', 'react', 'glassmorphism'],
    isTemplate: true
  },
];

let globalStore: Store | null = null;

async function saveToStore(key: string, value: unknown) {
  if (globalStore) {
    await globalStore.set(key, value);
    await globalStore.save();
  }
}

function App() {
  const [search, setSearch] = useState("");
  const [snippets, setSnippets] = useState<Snippet[]>(MOCK_SNIPPETS);
  const [selectedId, setSelectedId] = useState<string | null>('1');
  const [copied, setCopied] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [rightPanel, setRightPanel] = useState<'editor' | 'help'>('editor');
  const [showSettings, setShowSettings] = useState(false);
  const [hotkey, setHotkey] = useState('CommandOrControl+Shift+X');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const { locale, setLocale, t } = useLocale();

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    let isMounted = true;

    const initStore = async () => {
      try {
        const store = await load('snippets.json');
        globalStore = store;

        const savedSettings = await store.get<AppSettings>('settings');
        if (savedSettings && isMounted) {
          setTheme(savedSettings.theme ?? 'dark');
          if (savedSettings.locale) setLocale(savedSettings.locale);
          if (savedSettings.hotkey) {
            setHotkey(savedSettings.hotkey);
            invoke('update_shortcut', { shortcutStr: savedSettings.hotkey }).catch(console.error);
          } else {
            invoke('update_shortcut', { shortcutStr: 'CommandOrControl+Shift+X' }).catch(console.error);
          }
        } else {
          invoke('update_shortcut', { shortcutStr: 'CommandOrControl+Shift+X' }).catch(console.error);
        }

        const savedSnippets = await store.get<any[]>('snippets');
        if (isMounted) {
          if (savedSnippets && savedSnippets.length > 0) {
            // Apply migration from v4 schema
            const migrated = savedSnippets.map(s => {
              if (s.code !== undefined && !s.files) {
                return {
                  ...s,
                  files: [{
                    id: (s.id || Math.random().toString()) + '-file',
                    filename: 'main',
                    code: s.code,
                    language: s.language || 'text'
                  }],
                  code: undefined,
                  language: undefined,
                };
              }
              return s;
            }) as Snippet[];
            // Clean up undefined properties
            migrated.forEach(s => {
              delete (s as any).code;
              delete (s as any).language;
            });

            // Merge any brand new mock snippets that the user doesn't have yet
            // (e.g. the Glassmorphism example)
            let finalSnippets = [...migrated];
            MOCK_SNIPPETS.forEach(mock => {
              if (!finalSnippets.find(s => s.id === mock.id)) {
                finalSnippets.push(mock);
              }
            });

            setSnippets(finalSnippets);
            if (finalSnippets.length > 0) setSelectedId(finalSnippets[0].id);
            
            // Persist the merged list back to store so it doesn't try to merge every time
            await store.set('snippets', finalSnippets);
            await store.save();
          } else {
            await store.set('snippets', MOCK_SNIPPETS);
            await store.save();
          }
        }
      } catch (e) {
        console.error("Store init error:", e);
      }
    };
    initStore();

    return () => {
      isMounted = false;
    };
  }, []);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    snippets.forEach(s => s.tags.forEach(t => tagSet.add(t)));
    return [...tagSet].sort();
  }, [snippets]);

  const filteredSnippets = useMemo(() => {
    return snippets.filter(s => {
      const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
        s.files.some(f => f.code.toLowerCase().includes(search.toLowerCase()));
      const matchesTag = !activeTag || s.tags.includes(activeTag);
      const matchesFavorite = !showFavoritesOnly || s.isFavorite;
      return matchesSearch && matchesTag && matchesFavorite;
    });
  }, [snippets, search, activeTag, showFavoritesOnly]);

  const selectedIndex = useMemo(
    () => filteredSnippets.findIndex(s => s.id === selectedId),
    [filteredSnippets, selectedId]
  );

  const selectedSnippet = useMemo(
    () => (selectedIndex !== -1 ? filteredSnippets[selectedIndex] : filteredSnippets[0]) ?? null,
    [filteredSnippets, selectedIndex]
  );

  useEffect(() => {
    if (selectedSnippet && selectedSnippet.id !== selectedId) {
      setSelectedId(selectedSnippet.id);
    }
  }, [selectedSnippet, selectedId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!filteredSnippets.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedId(filteredSnippets[(selectedIndex + 1) % filteredSnippets.length].id);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedId(filteredSnippets[(selectedIndex - 1 + filteredSnippets.length) % filteredSnippets.length].id);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSnippet) doCopy(selectedSnippet.files[0].code);
    }
  };

  const handleCopyOrTemplate = (varValues: Record<string, string>, activeFileId?: string) => {
    if (!selectedSnippet) return;

    let textToCopy = '';

    // Helper to resolve variables in a string
    const resolveVars = (code: string) => {
      let result = code;
      Object.entries(varValues).forEach(([k, v]) => {
        if (v) {
          result = result.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
        }
      });
      return result;
    };

    if (selectedSnippet.files.length === 1) {
      textToCopy = resolveVars(selectedSnippet.files[0].code);
    } else {
      if (activeFileId) {
        // Option to just copy active tab if we desired, but let's default to copying the active tab just for standard behavior 
        // We'll stick to copying ONLY the active tab as standard for now, user didn't specify
        const activeFile = selectedSnippet.files.find(f => f.id === activeFileId);
        if (activeFile) {
          textToCopy = resolveVars(activeFile.code);
        }
      }
    }

    if (textToCopy) doCopy(textToCopy);
  };

  const doCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      getCurrentWindow().hide();
    }, 600);
  };

  const handleDelete = async (id: string) => {
    const updated = snippets.filter(s => s.id !== id);
    setSnippets(updated);
    await saveToStore('snippets', updated);
  };

  const handleAddSnippet = async (snippet: Snippet) => {
    const updated = [snippet, ...snippets];
    setSnippets(updated);
    setSelectedId(snippet.id);
    setShowForm(false);
    await saveToStore('snippets', updated);
  };

  const handleEditSnippet = async (snippet: Snippet) => {
    const updated = snippets.map(s => s.id === snippet.id ? snippet : s);
    setSnippets(updated);
    setEditingSnippet(null);
    await saveToStore('snippets', updated);
  };

  const saveSettingsToStore = async (newTheme: 'dark' | 'light', newLocale: 'en' | 'ru', newHotkey: string) => {
    await saveToStore('settings', { theme: newTheme, hotkey: newHotkey, locale: newLocale } as AppSettings);
  };

  const handleToggleFavorite = async (id: string) => {
    const updated = snippets.map(s => 
      s.id === id ? { ...s, isFavorite: !s.isFavorite } : s
    );
    setSnippets(updated);
    await saveToStore('snippets', updated);
  };

  const handleExport = () => {
    const data = JSON.stringify(snippets, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `snippetbox-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const imported = JSON.parse(content) as Snippet[];
        if (Array.isArray(imported)) {
          setSnippets(imported);
          await saveToStore('snippets', imported);
          if (imported.length > 0) setSelectedId(imported[0].id);
        }
      } catch (err) {
        console.error("Import failed:", err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    saveSettingsToStore(newTheme, locale, hotkey);
  };

  const handleHotkeyChange = async (newHotkey: string) => {
    setHotkey(newHotkey);
    saveSettingsToStore(theme, locale, newHotkey);
    try {
      await invoke('update_shortcut', { shortcutStr: newHotkey });
    } catch (err) {
      console.error("Failed to update shortcut dynamically:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="app-container"
    >
      <header className="search-header" data-tauri-drag-region>
        <Search size={18} color="var(--text-secondary)" style={{ opacity: 0.8 }} />
        <div className="search-input-wrap">
          <input
            ref={searchInputRef}
            className="search-input"
            placeholder={t.search.placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            className={`clear-search-btn ${search ? 'visible' : ''}`}
            onClick={() => setSearch('')}
            title={t.search.clear}
          >
            <X size={16} />
          </button>
        </div>
        <div className="header-actions">
          <button 
            className={`icon-btn ${showFavoritesOnly ? 'active accent-text' : ''}`}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            title={t.nav.favorites}
          >
            <StarIcon size={18} fill={showFavoritesOnly ? "currentColor" : "none"} />
          </button>
          <button className="icon-btn search-btn" onClick={() => setShowForm(true)} title={t.nav.create}>
            <Plus size={20} />
          </button>
          <button className="icon-btn search-btn" onClick={() => setShowSettings(true)} title={t.nav.settings}>
            <Settings size={20} />
          </button>
        </div>
      </header>

      <TagFilter allTags={allTags} activeTag={activeTag} onSelectTag={setActiveTag} />

      <main className="main-content">
        <aside className="sidebar-container">
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredSnippets.length > 0 ? (
              <Sidebar
                snippets={filteredSnippets}
                selectedId={selectedId}
                setSelectedId={(id) => { setSelectedId(id); setRightPanel('editor'); }}
                onToggleFavorite={handleToggleFavorite}
              />
            ) : (
              <EmptyState 
                icon={search ? SearchX : Library} 
                title={search ? t.search.noResults : t.search.addHint}
                description={search ? (locale === 'en' ? "Try a different keyword or filter" : "Попробуйте другое ключевое слово или фильтр") : (locale === 'en' ? "Start by creating your first code snippet" : "Начните с создания вашего первого сниппета")}
              />
            )}
          </div>
        </aside>

        <section className="right-panel">
          <div className="panel-tabs">
            <button
              className={`panel-tab ${rightPanel === 'editor' ? 'active' : ''}`}
              onClick={() => setRightPanel('editor')}
            >
              <Code2 size={14} />
              {t.editor.tabs.snippet}
            </button>
            <button
              className={`panel-tab ${rightPanel === 'help' ? 'active' : ''}`}
              onClick={() => setRightPanel('help')}
            >
              <HelpCircle size={14} />
              {t.editor.tabs.help}
            </button>
          </div>

          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            <AnimatePresence mode="wait">
              {selectedSnippet ? (
                <motion.div
                  key={selectedSnippet.id + rightPanel}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  {rightPanel === 'editor' ? (
                    <Editor
                      snippet={selectedSnippet}
                      copied={copied}
                      onCopy={handleCopyOrTemplate}
                      onEdit={(s) => {
                        setEditingSnippet(s);
                        setShowForm(true);
                      }}
                      onDelete={handleDelete}
                      theme={theme}
                    />
                  ) : (
                    <HelpPanel />
                  )}
                </motion.div>
              ) : (
                <EmptyState 
                  icon={StarIcon}
                  title={showFavoritesOnly ? t.empty.noFavorites : t.empty.noSelected}
                  description={showFavoritesOnly ? t.empty.noFavoritesDesc : t.empty.noSelectedDesc}
                />
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {(showForm || editingSnippet) && (
          <SnippetForm
            onAdd={handleAddSnippet}
            onEdit={handleEditSnippet}
            editingSnippet={editingSnippet}
            onClose={() => {
              setShowForm(false);
              setEditingSnippet(null);
              searchInputRef.current?.focus();
            }}
            theme={theme}
          />
        )}
        {showSettings && (
          <SettingsModal
            onClose={() => setShowSettings(false)}
            theme={theme}
            onThemeChange={handleThemeChange}
            hotkey={hotkey}
            onHotkeyChange={handleHotkeyChange}
            onExport={handleExport}
            onImport={handleImport}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AppWithLocale() {
  return (
    <LocaleProvider>
      <App />
    </LocaleProvider>
  );
}

export default AppWithLocale;

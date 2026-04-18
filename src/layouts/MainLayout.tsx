import React, { useRef, Suspense, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Settings, Star as StarIcon, FolderOpen, Heart } from "lucide-react";

import { useLocale } from '../context/LocaleContext';
import { usePlatform } from '../context/PlatformContext';
import { useUIStore } from '../store/useUIStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useSnippetStore } from '../store/useSnippetStore';

const Sidebar = React.lazy(() => import('../components/Sidebar').then(m => ({ default: m.Sidebar })));
const Editor = React.lazy(() => import('../components/Editor').then(m => ({ default: m.Editor })));
const HelpPanel = React.lazy(() => import('../components/HelpPanel').then(m => ({ default: m.HelpPanel })));
const SettingsModal = React.lazy(() => import('../components/SettingsModal').then(m => ({ default: m.SettingsModal })));
const SnippetForm = React.lazy(() => import('../components/SnippetForm').then(m => ({ default: m.SnippetForm })));
const HistoryPanel = React.lazy(() => import('../components/HistoryPanel').then(m => ({ default: m.HistoryPanel })));
import { LoadingSpinner } from '../components/ui/Loading';
import { TagFilter } from '../components/TagFilter';
import { EmptyState } from '../components/EmptyState';
import { ResizeHandle } from '../components/ui/ResizeHandle';
import emptyStyles from '../components/EmptyState.module.css';
import { useGlobalHotkeys } from '../hooks/useHotkeys';
import { APP_NAME, ICON_SIZE } from '../utils/constants';

import { IconButton } from '../components/ui/IconButton';
import { Input } from '../components/ui/Input';
import styles from './MainLayout.module.css';

export function MainLayout() {
  const { t } = useLocale();
  const { resolvePlaceholders } = usePlatform();

  const {
    isSettingsOpen, isFormOpen, rightPanel,
    setSettingsOpen, setFormOpen, setRightPanel,
    editingSnippetId
  } = useUIStore();

  const theme = useSettingsStore(state => state.theme);
  const sidebarWidth = useSettingsStore(state => state.sidebarWidth);

  const searchQuery = useSnippetStore(state => state.searchQuery);
  const setSearchQuery = useSnippetStore(state => state.setSearchQuery);
  const activeCollection = useSnippetStore(state => state.activeCollection);
  const setActiveCollection = useSnippetStore(state => state.setActiveCollection);
  const selectedId = useSnippetStore(state => state.selectedId);

  const searchInputRef = useRef<HTMLInputElement>(null);
  useGlobalHotkeys(searchInputRef);

  const emptyContent = useMemo(() => {
    if (activeCollection === 'favorites') {
      return {
        icon: Heart,
        title: t.empty.noFavorites,
        description: t.empty.noFavoritesDesc
      };
    }

    if (activeCollection.startsWith('folder:')) {
      return {
        icon: FolderOpen,
        title: t.empty.noFolderSnippets,
        description: t.empty.noFolderSnippetsDesc
      };
    }

    if (!['all', 'favorites', 'recent'].includes(activeCollection)) {
      return {
        icon: StarIcon,
        title: t.empty.noLanguageSnippets.replace('{lang}', activeCollection),
        description: t.empty.noLanguageSnippetsDesc.replace('{lang}', activeCollection)
      };
    }

    return {
      icon: StarIcon,
      title: t.empty.noSelected,
      description: t.empty.noSelectedDesc
    };
  }, [activeCollection, t]);

  return (
    <div className={`app-container ${theme}`}>
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <div className={styles.logoIconWrap}>
            <img src="/src/assets/logo.png" className={styles.logoImage} alt="Snippet Box" />
          </div>
          <div className={styles.logoText}>{APP_NAME}</div>
        </div>

        <div className={styles.searchWrap}>
          <Input
            ref={searchInputRef}
            placeholder={resolvePlaceholders(t.search.placeholder)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search size={ICON_SIZE.MD} />}
            onClear={() => setSearchQuery('')}
            size="md"
          />
        </div>

        <div className={styles.headerActions}>
          <IconButton
            icon={<Plus size={ICON_SIZE.MD_UI} />}
            onClick={() => setFormOpen(true)}
            title={t.nav.create}
            aria-label={t.nav.create}
            variant="ghost"
          />
          <IconButton
            icon={<Settings size={ICON_SIZE.MD_UI} />}
            onClick={() => setSettingsOpen(true)}
            title={resolvePlaceholders(t.settings.hotkeyHint)}
            aria-label={t.common.settings}
            variant="ghost"
          />
        </div>
      </header>

      <TagFilter />

      <main className="main-content">
        <aside
          className="sidebar-container"
          style={{
            width: sidebarWidth,
            minWidth: sidebarWidth,
            maxWidth: sidebarWidth
          }}
        >
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <Suspense fallback={<LoadingSpinner />}>
              <Sidebar />
            </Suspense>
          </div>
        </aside>

        <ResizeHandle />

        <section className="right-panel">
          <div className={styles.panelTabs}>
            <button
              className={`${styles.panelTab} ${rightPanel === 'editor' ? styles.panelTabActive : ''}`}
              onClick={() => setRightPanel('editor')}
            >
              {t.editor.tabs.snippet}
            </button>
            <button
              className={`${styles.panelTab} ${rightPanel === 'help' ? styles.panelTabActive : ''}`}
              onClick={() => setRightPanel('help')}
            >
              {t.editor.tabs.help}
            </button>
            {selectedId && (
              <button
                className={`${styles.panelTab} ${rightPanel === 'history' ? styles.panelTabActive : ''}`}
                onClick={() => setRightPanel('history')}
              >
                {t.editor.tabs.history}
              </button>
            )}
          </div>

          <div className={styles.contentWrapper}>
            <AnimatePresence mode="wait">
              <motion.div
                key={rightPanel + (rightPanel === 'help' ? 'help' : selectedId)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ height: '100%' }}
              >
                <Suspense fallback={<LoadingSpinner />}>
                  {rightPanel === 'help' ? (
                    <HelpPanel />
                  ) : rightPanel === 'history' ? (
                    <HistoryPanel />
                  ) : selectedId ? (
                    <Editor />
                  ) : (
                    <EmptyState
                      icon={emptyContent.icon}
                      title={emptyContent.title}
                      description={emptyContent.description}
                      action={
                        activeCollection !== 'all' && (
                          <button
                            className={emptyStyles.button}
                            onClick={() => setActiveCollection('all')}
                          >
                            {t.common.showAll}
                          </button>
                        )
                      }
                    />
                  )}
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </main>

      <AnimatePresence>
        <Suspense fallback={null}>
          {isFormOpen && <SnippetForm key={editingSnippetId || 'new'} />}
          {isSettingsOpen && <SettingsModal />}
        </Suspense>
      </AnimatePresence>
    </div>
  );
}

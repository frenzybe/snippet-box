import { useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useShallow } from 'zustand/react/shallow';
import { useUIStore } from '../store/useUIStore';
import { useSnippetStore, selectSortedSnippets } from '../store/useSnippetStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useToastStore } from '../store/useToastStore';
import { useLocale } from '../context/LocaleContext';

export function useGlobalHotkeys(searchInputRef: React.RefObject<HTMLInputElement | null>) {
  const { t } = useLocale();
  const setFormOpen = useUIStore(state => state.setFormOpen);
  const addToast = useToastStore(state => state.addToast);
  const hideOnCopy = useSettingsStore(state => state.hideOnCopy);

  const selectedId = useSnippetStore(state => state.selectedId);
  const setSelectedId = useSnippetStore(state => state.setSelectedId);
  const sortedSnippets = useSnippetStore(useShallow(selectSortedSnippets));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on CMD/CTRL + F
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
        return;
      }

      // New snippet on CMD/CTRL + N
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        setFormOpen(true);
        return;
      }

      // Quick Copy on Enter
      if (e.key === 'Enter' && selectedId && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
        // Only if search is focused or nothing is focused (global list action)
        const isInputFocused = document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA';
        if (isInputFocused || document.activeElement === document.body) {
          const snippet = sortedSnippets.find(s => s.id === selectedId);
          if (snippet && snippet.files.length > 0) {
            e.preventDefault();
            navigator.clipboard.writeText(snippet.files[0].code);
            addToast(t.toasts.copied, 'success');
            if (hideOnCopy) {
              invoke('hide_app');
            }
          }
        }
        return;
      }

      // Navigation
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (sortedSnippets.length === 0) return;

        e.preventDefault();
        const currentIndex = sortedSnippets.findIndex(s => s.id === selectedId);
        let nextIndex = currentIndex;

        if (e.key === 'ArrowDown') {
          nextIndex = currentIndex < sortedSnippets.length - 1 ? currentIndex + 1 : 0;
        } else {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : sortedSnippets.length - 1;
        }

        const nextSnippet = sortedSnippets[nextIndex];
        if (nextSnippet) {
          setSelectedId(nextSnippet.id);
          // Scroll the selected item into view if possible
          const element = document.querySelector(`[data-snippet-id="${nextSnippet.id}"]`);
          element?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchInputRef, setFormOpen, selectedId, setSelectedId, sortedSnippets, hideOnCopy, t.toasts.copied, addToast]);
}

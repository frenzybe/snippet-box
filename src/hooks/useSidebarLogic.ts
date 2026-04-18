import { useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Snippet } from '../types';
import { useSnippetStore, selectSortedSnippets } from '../store/useSnippetStore';
import { useFolderStore } from '../store/useFolderStore';
import { useUIStore } from '../store/useUIStore';

export function useSidebarLogic() {
  const folderSnippetIds = useFolderStore(state => state.folderSnippetIds);
  const sortedSnippets = useSnippetStore(useShallow(state => selectSortedSnippets(state, folderSnippetIds)));

  const {
    selectedId,
    activeCollection,
    setSelectedId,
    toggleSelection,
    selectAll
  } = useSnippetStore(useShallow(state => ({
    selectedId: state.selectedId,
    activeCollection: state.activeCollection,
    setSelectedId: state.setSelectedId,
    toggleSelection: state.toggleSelection,
    selectAll: state.selectAll
  })));

  const setRightPanel = useUIStore(state => state.setRightPanel);

  const handleSnippetClick = useCallback((e: React.MouseEvent, snippet: Snippet) => {
    const isMulti = e.metaKey || e.ctrlKey;
    const isRange = e.shiftKey;

    if (isMulti) {
      toggleSelection(snippet.id);
    } else if (isRange && selectedId) {
      const idx1 = sortedSnippets.findIndex(s => s.id === selectedId);
      const idx2 = sortedSnippets.findIndex(s => s.id === snippet.id);
      if (idx1 !== -1 && idx2 !== -1) {
        const start = Math.min(idx1, idx2);
        const end = Math.max(idx1, idx2);
        const rangeIds = sortedSnippets.slice(start, end + 1).map(s => s.id);
        selectAll(rangeIds);
      }
    } else {
      setSelectedId(snippet.id);
      setRightPanel('editor');
    }
  }, [selectedId, sortedSnippets, setSelectedId, toggleSelection, selectAll, setRightPanel]);

  return {
    sortedSnippets,
    handleSnippetClick,
    selectedId,
    activeCollection
  };
}

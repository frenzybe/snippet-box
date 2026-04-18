import { create } from 'zustand';

interface UIState {
  isSettingsOpen: boolean;
  isFormOpen: boolean;
  editingSnippetId: string | null;
  rightPanel: 'editor' | 'help' | 'history';

  setSettingsOpen: (open: boolean) => void;
  setFormOpen: (open: boolean) => void;
  setEditingSnippetId: (id: string | null) => void;
  setRightPanel: (panel: 'editor' | 'help' | 'history') => void;
  historyRefreshKey: number;
  triggerHistoryRefresh: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSettingsOpen: false,
  isFormOpen: false,
  editingSnippetId: null,
  rightPanel: 'editor',

  setSettingsOpen: (isSettingsOpen) => set({ isSettingsOpen }),
  setFormOpen: (isFormOpen) => set({ isFormOpen }),
  setEditingSnippetId: (editingSnippetId) => set({ editingSnippetId }),
  setRightPanel: (rightPanel) => set({ rightPanel }),
  historyRefreshKey: 0,
  triggerHistoryRefresh: () => set(state => ({ historyRefreshKey: state.historyRefreshKey + 1 })),
}));

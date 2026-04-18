import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { storageService } from '../services/storage';
import { sqlStorage } from '../services/sqlStorage';
import { DEFAULT_SNIPPETS } from '../utils/demoData';
import { useUIStore } from './useUIStore';
import { SnippetState } from '../types/store';
import { getMetadata } from './utils/snippetHelpers';

let isInitializing = false;
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

export const useSnippetStore = create<SnippetState>((set, get) => ({
  snippets: [],
  selectedId: null,
  selectedIds: [],
  searchQuery: '',
  activeTag: null,
  activeCollection: 'all',
  searchResults: null,
  allTags: [],
  allLanguages: [],
  isInitialized: false,

  setSearchQuery: async (query) => {
    set({ searchQuery: query });

    if (searchTimeout) clearTimeout(searchTimeout);

    if (!query.trim()) {
      set({ searchResults: null });
      return;
    }

    searchTimeout = setTimeout(async () => {
      try {
        const results = await sqlStorage.searchSnippets(query);
        set({ searchResults: results });
      } catch (err) {
        console.error("SnippetStore: FTS search failed:", err);
      }
    }, 150);
  },

  setActiveTag: (activeTag) => set({ activeTag }),

  setActiveCollection: (activeCollection) => set({ activeCollection, activeTag: null }),

  setSelectedId: async (selectedId) => {
    set({ selectedId, selectedIds: [] });
    if (!selectedId) return;

    const snippet = get().snippets.find(s => s.id === selectedId);
    if (snippet && snippet.files.length > 0 && snippet.files.some(f => f.code === '')) {
      try {
        const fullFiles = await sqlStorage.getSnippetFiles(selectedId);
        set(state => ({
          snippets: state.snippets.map(s =>
            s.id === selectedId ? { ...s, files: fullFiles } : s
          )
        }));
      } catch (err) {
        console.error("SnippetStore: Failed to lazy load snippet code:", err);
      }
    }
  },

  toggleSelection: (id) => set((state) => ({
    selectedIds: state.selectedIds.includes(id)
      ? state.selectedIds.filter(sid => sid !== id)
      : [...state.selectedIds, id]
  })),

  clearSelection: () => set({ selectedIds: [] }),

  selectAll: (ids) => set({ selectedIds: ids }),

  initSnippets: async () => {
    if (get().isInitialized || isInitializing) return;
    isInitializing = true;

    try {
      let snippets = await sqlStorage.getAllSnippets();

      if (snippets.length === 0) {
        const oldSnippets = await storageService.getSnippets();
        if (oldSnippets && oldSnippets.length > 0) {
          console.log("SnippetStore: Performing migration to SQLite...");
          await sqlStorage.migrateFromStore(oldSnippets);
          snippets = await sqlStorage.getAllSnippets();
        } else {
          console.log("SnippetStore: Initializing with default data...");
          await sqlStorage.migrateFromStore(DEFAULT_SNIPPETS);
          snippets = await sqlStorage.getAllSnippets();
        }
      }

      const initialId = snippets?.length > 0 ? snippets[0].id : null;
      const meta = getMetadata(snippets);

      set({
        snippets,
        ...meta,
        isInitialized: true
      });

      if (initialId) {
        await get().setSelectedId(initialId);
      }
    } catch (err) {
      console.error("SnippetStore: Failed to load snippets from SQL:", err);
      set({ isInitialized: true });
    } finally {
      isInitializing = false;
    }
  },

  importSnippets: async (newSnippets) => {
    const existingIds = new Set(get().snippets.map(s => s.id));
    const toAdd = newSnippets.filter(s => !existingIds.has(s.id));

    if (toAdd.length > 0) {
      const merged = [...get().snippets, ...toAdd];
      const meta = getMetadata(merged);
      set({ snippets: merged, ...meta });
      console.log(`SnippetStore: Importing ${toAdd.length} snippets...`);
      await sqlStorage.saveSnippetsBulk(toAdd);
    }
  },

  addSnippet: async (snippet) => {
    const updated = [snippet, ...get().snippets];
    const meta = getMetadata(updated);
    set({ snippets: updated, selectedId: snippet.id, ...meta });
    await sqlStorage.saveSnippet(snippet);
  },

  updateSnippet: async (snippet) => {
    const updated = get().snippets.map((s) => (s.id === snippet.id ? snippet : s));
    const meta = getMetadata(updated);
    set({ snippets: updated, ...meta });
    await sqlStorage.saveSnippet(snippet);
    useUIStore.getState().triggerHistoryRefresh();
  },

  deleteSnippet: async (id) => {
    const updated = get().snippets.filter((s) => s.id !== id);
    const newSelectedId = get().selectedId === id
      ? (updated.length > 0 ? updated[0].id : null)
      : get().selectedId;

    const meta = getMetadata(updated);
    set({ snippets: updated, selectedId: newSelectedId, selectedIds: get().selectedIds.filter(sid => sid !== id), ...meta });
    await sqlStorage.deleteSnippet(id);
  },

  bulkDelete: async (ids) => {
    const setIds = new Set(ids);
    const updated = get().snippets.filter(s => !setIds.has(s.id));
    const meta = getMetadata(updated);
    set({
      snippets: updated,
      selectedIds: [],
      selectedId: setIds.has(get().selectedId!) ? (updated[0]?.id || null) : get().selectedId,
      ...meta
    });

    await sqlStorage.bulkDeleteSnippets(ids);

    if (get().activeCollection === 'favorites') {
      const remainingFavs = updated.filter(s => s.isFavorite);
      if (remainingFavs.length === 0) {
        set({ activeCollection: 'all' });
      }
    }
  },

  toggleFavorite: async (id) => {
    const snippet = get().snippets.find(s => s.id === id);
    if (!snippet) return;

    const updatedSnippet = { ...snippet, isFavorite: !snippet.isFavorite };
    const updatedSnippets = get().snippets.map((s) =>
      s.id === id ? updatedSnippet : s
    );

    set({ snippets: updatedSnippets });
    await sqlStorage.saveSnippet(updatedSnippet);

    if (get().activeCollection === 'favorites') {
      const hasFavorites = updatedSnippets.some(s => s.isFavorite);
      if (!hasFavorites) {
        set({ activeCollection: 'all' });
      }
    }
  },

  duplicateSnippet: async (id: string) => {
    const original = get().snippets.find(s => s.id === id);
    if (!original) return;

    const duplicate = {
      ...original,
      id: uuidv4(),
      title: `${original.title} (copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      files: original.files.map(f => ({
        ...f,
        id: uuidv4(),
      }))
    };

    await get().addSnippet(duplicate);
  },

  bulkToggleFavorite: async (ids, favorite) => {
    const setIds = new Set(ids);
    const updatedSnippets = get().snippets.map(s => {
      if (setIds.has(s.id)) {
        return { ...s, isFavorite: favorite };
      }
      return s;
    });
    set({ snippets: updatedSnippets });

    await sqlStorage.bulkToggleFavorite(ids, favorite);

    if (get().activeCollection === 'favorites') {
      const hasFavorites = updatedSnippets.some(s => s.isFavorite);
      if (!hasFavorites) {
        set({ activeCollection: 'all' });
      }
    }
  },

  restoreVersion: async (versionSnippet) => {
    await sqlStorage.saveSnippet(versionSnippet);
    useUIStore.getState().triggerHistoryRefresh();

    const updated = get().snippets.map(s => s.id === versionSnippet.id ? versionSnippet : s);
    const meta = getMetadata(updated);
    set({
      snippets: updated,
      ...meta
    });
  }
}));

export * from './utils/snippetSelectors';

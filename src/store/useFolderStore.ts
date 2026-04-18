import { create } from 'zustand';
import { Folder } from '../types';
import { sqlStorage } from '../services/sqlStorage';
import { v4 as uuidv4 } from 'uuid';
import { FolderState } from '../types/store';

export const useFolderStore = create<FolderState>((set, get) => ({
  folders: [],
  folderSnippetIds: {},
  isInitialized: false,

  initFolders: async () => {
    if (get().isInitialized) return;
    
    try {
      const [folders, assignments] = await Promise.all([
        sqlStorage.getFolders(),
        sqlStorage.getAllFolderAssignments()
      ]);
      
      set({ 
        folders, 
        folderSnippetIds: assignments,
        isInitialized: true 
      });
    } catch (err) {
      console.error('FolderStore: Failed to initialize folders', err);
      set({ isInitialized: true });
    }
  },

  createFolder: async (name, color) => {
    const newFolder: Folder = {
      id: uuidv4(),
      name,
      color,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    set(state => ({ folders: [...state.folders, newFolder].sort((a, b) => a.name.localeCompare(b.name)) }));
    await sqlStorage.saveFolder(newFolder);
    return newFolder.id;
  },

  updateFolder: async (id, name, color) => {
    const existing = get().folders.find(f => f.id === id);
    if (!existing) return;

    const updatedFolder: Folder = {
      ...existing,
      name,
      color,
      updatedAt: Date.now()
    };

    set(state => ({
      folders: state.folders.map(f => f.id === id ? updatedFolder : f).sort((a, b) => a.name.localeCompare(b.name))
    }));
    await sqlStorage.saveFolder(updatedFolder);
  },

  deleteFolder: async (id) => {
    const { [id]: removed, ...remainingIds } = get().folderSnippetIds;
    set(state => ({
      folders: state.folders.filter(f => f.id !== id),
      folderSnippetIds: remainingIds
    }));
    await sqlStorage.deleteFolder(id);
  },

  addSnippetToFolder: async (snippetId, folderId) => {
    const current = get().folderSnippetIds[folderId] || [];
    if (current.includes(snippetId)) return;

    const folderSnippetIds = {
      ...get().folderSnippetIds,
      [folderId]: [...current, snippetId]
    };
    set({ folderSnippetIds });
    await sqlStorage.addSnippetToFolder(snippetId, folderId);
  },

  removeSnippetFromFolder: async (snippetId, folderId) => {
    const current = get().folderSnippetIds[folderId] || [];
    if (!current.includes(snippetId)) return;

    const folderSnippetIds = {
      ...get().folderSnippetIds,
      [folderId]: current.filter(id => id !== snippetId)
    };
    set({ folderSnippetIds });
    await sqlStorage.removeSnippetFromFolder(snippetId, folderId);
  },

  toggleSnippetInFolder: async (snippetId, folderId) => {
    const current = get().folderSnippetIds[folderId] || [];
    if (current.includes(snippetId)) {
      await get().removeSnippetFromFolder(snippetId, folderId);
    } else {
      await get().addSnippetToFolder(snippetId, folderId);
    }
  }
}));

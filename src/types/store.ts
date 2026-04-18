import { Snippet, Folder } from './index';

export type SmartCollection = 'all' | 'favorites' | 'recent' | string; // string for language names

export interface SnippetState {
  snippets: Snippet[];
  selectedId: string | null;
  selectedIds: string[]; // For multi-selection
  searchQuery: string;
  activeTag: string | null;
  activeCollection: SmartCollection;
  searchResults: string[] | null; // IDs from FTS search
  allTags: string[];
  allLanguages: string[];
  isInitialized: boolean;

  // Actions
  setSearchQuery: (query: string) => void;
  setActiveTag: (tag: string | null) => void;
  setActiveCollection: (collection: SmartCollection) => void;
  setSelectedId: (id: string | null) => Promise<void>;
  
  // Multi-selection
  toggleSelection: (id: string) => void;
  clearSelection: () => void;
  selectAll: (ids: string[]) => void;
  
  // CRUD & Bulk
  addSnippet: (snippet: Snippet) => Promise<void>;
  updateSnippet: (snippet: Snippet) => Promise<void>;
  deleteSnippet: (id: string) => Promise<void>;
  bulkDelete: (ids: string[]) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  duplicateSnippet: (id: string) => Promise<void>;
  bulkToggleFavorite: (ids: string[], favorite: boolean) => Promise<void>;
  importSnippets: (newSnippets: Snippet[]) => Promise<void>;
  restoreVersion: (snippet: Snippet) => Promise<void>;
  
  // Init
  initSnippets: () => Promise<void>;
}

export interface FolderState {
  folders: Folder[];
  folderSnippetIds: Record<string, string[]>; // folderId -> snippetId[]
  isInitialized: boolean;

  // Actions
  initFolders: () => Promise<void>;
  createFolder: (name: string, color: string) => Promise<string>;
  updateFolder: (id: string, name: string, color: string) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  
  // Snippet Assignment
  addSnippetToFolder: (snippetId: string, folderId: string) => Promise<void>;
  removeSnippetFromFolder: (snippetId: string, folderId: string) => Promise<void>;
  toggleSnippetInFolder: (snippetId: string, folderId: string) => Promise<void>;
}

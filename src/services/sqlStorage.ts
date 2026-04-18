import { DbCore } from './db/core';
import { snippetService } from './db/snippetService';
import { folderService } from './db/folderService';
import { historyService } from './db/historyService';

/**
 * Senior-level Facade for SQL Storage.
 * Composes specialized services while maintaining a unified API for the application.
 */
export const sqlStorage = {
  // DB Core & Initialization
  getDb: () => DbCore.getDb(),
  
  // Snippets
  getAllSnippets: () => snippetService.getAllSnippets(),
  getSnippetById: (id: string) => snippetService.getSnippetById(id),
  getSnippetFiles: (snippetId: string) => snippetService.getSnippetFiles(snippetId),
  saveSnippet: (snippet: any, useTransaction?: boolean) => snippetService.saveSnippet(snippet, useTransaction),
  saveSnippetsBulk: (snippets: any[]) => snippetService.bulkSaveSnippets(snippets),
  deleteSnippet: (id: string) => snippetService.deleteSnippet(id),
  bulkDeleteSnippets: (ids: string[]) => snippetService.bulkDeleteSnippets(ids),
  bulkToggleFavorite: (ids: string[], favorite: boolean) => snippetService.bulkToggleFavorite(ids, favorite),
  searchSnippets: (query: string) => snippetService.searchSnippets(query),
  migrateFromStore: (snippets: any[]) => snippetService.bulkSaveSnippets(snippets),
  resetAllData: () => snippetService.resetAllData(),

  // Folders
  getFolders: () => folderService.getFolders(),
  saveFolder: (folder: any) => folderService.saveFolder(folder),
  deleteFolder: (id: string) => folderService.deleteFolder(id),
  addSnippetToFolder: (snippetId: string, folderId: string) => folderService.addSnippetToFolder(snippetId, folderId),
  removeSnippetFromFolder: (snippetId: string, folderId: string) => folderService.removeSnippetFromFolder(snippetId, folderId),
  getSnippetIdsByFolder: (folderId: string) => folderService.getSnippetIdsByFolder(folderId),
  getAllFolderAssignments: () => folderService.getAllFolderAssignments(),

  // History
  getSnippetHistory: (snippetId: string) => historyService.getSnippetHistory(snippetId),
  deleteSnippetHistoryEntry: (historyId: string) => historyService.deleteSnippetHistoryEntry(historyId),
  clearSnippetHistory: (snippetId: string) => historyService.clearSnippetHistory(snippetId)
};

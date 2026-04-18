import { load, Store } from '@tauri-apps/plugin-store';
import { save, open } from '@tauri-apps/plugin-dialog';
import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs';
import { Snippet, AppSettings } from '../types';
import { snippetService } from './db/snippetService';
import { folderService } from './db/folderService';

let globalStore: Store | null = null;
let initPromise: Promise<Store> | null = null;
const STORE_NAME = 'snippets.json';

export const storageService = {
  async init() {
    console.log("Storage: Initializing...");
    if (globalStore) return globalStore;
    if (initPromise) return initPromise;

    initPromise = load(STORE_NAME).then(store => {
      console.log("Storage: Store loaded successfully");
      globalStore = store;
      return store;
    }).catch(err => {
      console.error("Storage: Failed to load store", err);
      throw err;
    });

    return initPromise;
  },

  async getSnippets(): Promise<Snippet[] | null> {
    const store = await this.init();
    const data = await store.get<Snippet[]>('snippets');
    return data ?? null;
  },

  async saveSnippets(snippets: Snippet[]) {
    const store = await this.init();
    await store.set('snippets', snippets);
    await store.save();
  },

  async getSettings(): Promise<AppSettings | null> {
    console.log("Storage: Getting settings...");
    const store = await this.init();
    const settings = await store.get<AppSettings>('settings');
    console.log("Storage: Settings retrieved:", settings);
    return settings ?? null;
  },

  async saveSettings(settings: AppSettings) {
    console.log("Storage: Saving settings...", settings);
    const store = await this.init();
    await store.set('settings', settings);
    await store.save();
    console.log("Storage: Settings saved");
  },

  async exportBackup() {
    try {
      const filePath = await save({
        filters: [{
          name: 'JSON',
          extensions: ['json']
        }],
        defaultPath: 'snippet_box_backup.json'
      });

      if (filePath) {
        const { snippets, history } = await snippetService.getBackupData();
        const folders = await folderService.getFolders();
        const folderAssignments = await folderService.getAllFolderAssignments();
        const settings = await this.getSettings();

        const content = JSON.stringify({
          version: '2.0.0',
          exportedAt: new Date().toISOString(),
          snippets,
          folders,
          folderAssignments,
          history,
          settings
        }, null, 2);

        await writeTextFile(filePath, content);
        return true;
      }
    } catch (error) {
      console.error('Failed to export backup:', error);
      throw error;
    }
    return false;
  },

  async importBackup(): Promise<{ success: boolean; error?: string }> {
    try {
      const selected = await open({
        multiple: false,
        filters: [{
          name: 'JSON',
          extensions: ['json']
        }]
      });

      if (selected && typeof selected === 'string') {
        const content = await readTextFile(selected);
        const data = JSON.parse(content);

        if (!data.snippets || !Array.isArray(data.snippets)) {
          return { success: false, error: 'Invalid backup format' };
        }

        if (data.folders) {
          await folderService.bulkImportFolders(data.folders);
        }

        await snippetService.bulkSaveSnippets(data.snippets);

        if (data.folderAssignments) {
          await folderService.bulkImportAssignments(data.folderAssignments);
        }

        if (data.history) {
          await snippetService.bulkImportHistory(data.history);
        }

        if (data.settings) {
          await this.saveSettings(data.settings);
        }

        return { success: true };
      }
    } catch (error) {
      console.error('Failed to import backup:', error);
      return { success: false, error: 'Failed to read backup file' };
    }
    return { success: false };
  },

  async performFactoryReset() {
    console.log("Storage: Performing Smart Reset...");
    const store = await this.init();

    const settings = await store.get<AppSettings>('settings');

    await store.clear();

    if (settings) {
      await store.set('settings', settings);
    }
    await store.save();

    try {
      await snippetService.resetAllData();
    } catch (err) {
      console.error("Storage: Failed to clear SQL during reset", err);
    }

    window.location.reload();
  }
};

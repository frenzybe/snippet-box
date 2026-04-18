import { create } from 'zustand';
import { storageService } from '../services/storage';
import { invoke } from '@tauri-apps/api/core';
import { AppTheme } from '../types';

interface SettingsState {
  theme: AppTheme;
  locale: 'en' | 'ru';
  hotkey: string;
  lineWrapping: boolean;
  hideOnCopy: boolean;
  iconPack: 'brand' | 'classic' | 'minimal';
  fontSize: number;
  sidebarWidth: number;
  showLineNumbers: boolean;
  tabSize: number;
  highlightActiveLine: boolean;
  isInitialized: boolean;

  setTheme: (theme: AppTheme) => void;
  setLocale: (locale: 'en' | 'ru') => void;
  setLineWrapping: (lineWrapping: boolean) => void;
  setHideOnCopy: (hideOnCopy: boolean) => void;
  setIconPack: (pack: 'brand' | 'classic' | 'minimal') => void;
  setFontSize: (fontSize: number) => void;
  setSidebarWidth: (width: number) => void;
  setShowLineNumbers: (showLineNumbers: boolean) => void;
  setTabSize: (tabSize: number) => void;
  setHighlightActiveLine: (highlightActiveLine: boolean) => void;
  setHotkey: (hotkey: string) => Promise<void>;
  initSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  theme: 'dark',
  locale: 'en',
  hotkey: 'CommandOrControl+Shift+X',
  lineWrapping: true,
  hideOnCopy: true,
  iconPack: 'brand',
  fontSize: 14,
  sidebarWidth: 260,
  showLineNumbers: true,
  tabSize: 2,
  highlightActiveLine: true,
  isInitialized: false,

  setTheme: async (theme) => {
    set({ theme });
    await storageService.saveSettings({
      ...get(),
      theme
    });
  },

  setLocale: async (locale) => {
    set({ locale });
    await storageService.saveSettings({
      ...get(),
      locale
    });
  },

  setHotkey: async (hotkey) => {
    try {
      await invoke('update_shortcut', { shortcutStr: hotkey });
      set({ hotkey });
      await storageService.saveSettings({
        ...get(),
        hotkey
      });
    } catch (err) {
      console.error("Failed to update shortcut:", err);
      throw err;
    }
  },

  setLineWrapping: async (lineWrapping) => {
    set({ lineWrapping });
    await storageService.saveSettings({
      ...get(),
      lineWrapping
    });
  },

  setHideOnCopy: async (hideOnCopy) => {
    set({ hideOnCopy });
    await storageService.saveSettings({
      ...get(),
      hideOnCopy
    });
  },

  setIconPack: async (iconPack) => {
    set({ iconPack });
    await storageService.saveSettings({
      ...get(),
      iconPack
    });
  },

  setFontSize: async (fontSize) => {
    set({ fontSize });
    await storageService.saveSettings({
      ...get(),
      fontSize
    });
  },

  setSidebarWidth: async (sidebarWidth) => {
    set({ sidebarWidth });
    await storageService.saveSettings({
      ...get(),
      sidebarWidth
    });
  },

  setShowLineNumbers: async (showLineNumbers) => {
    set({ showLineNumbers });
    await storageService.saveSettings({
      ...get(),
      showLineNumbers
    });
  },

  setTabSize: async (tabSize) => {
    set({ tabSize });
    await storageService.saveSettings({
      ...get(),
      tabSize
    });
  },

  setHighlightActiveLine: async (highlightActiveLine) => {
    set({ highlightActiveLine });
    await storageService.saveSettings({
      ...get(),
      highlightActiveLine
    });
  },

  initSettings: async () => {
    try {
      const saved = await storageService.getSettings();
      if (saved) {
        set({
          theme: saved.theme ?? 'dark',
          locale: saved.locale,
          hotkey: saved.hotkey,
          lineWrapping: saved.lineWrapping ?? true,
          hideOnCopy: saved.hideOnCopy ?? true,
          iconPack: saved.iconPack ?? 'brand',
          fontSize: saved.fontSize ?? 14,
          sidebarWidth: saved.sidebarWidth ?? 260,
          showLineNumbers: saved.showLineNumbers ?? true,
          tabSize: saved.tabSize ?? 2,
          highlightActiveLine: saved.highlightActiveLine ?? true
        });
        invoke('update_shortcut', { shortcutStr: saved.hotkey }).catch(console.error);
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      set({ isInitialized: true });
    }
  }
}));

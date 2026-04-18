/**
 * Basic mocks for Tauri APIs to prevent the app from crashing in a standard browser.
 * This allows for faster UI/CSS iteration without running the full Tauri environment.
 */

const isTauri = !!(window as any).__TAURI_INTERNALS__;

if (!isTauri) {
  console.warn("SnippetBox: Running in browser mode. Tauri APIs are mocked.");

  (window as any).invoke = async (cmd: string, args?: any) => {
    console.log(`[Mock Invoke] ${cmd}`, args);
    if (cmd === 'show_app' || cmd === 'hide_app') return;
    if (cmd === 'update_shortcut') return;
    return null;
  };

  // Mock for tauri-plugin-sql
  (window as any).__TAURI_SQL__ = {
    execute: async () => [],
    select: async () => [],
    load: async () => ({
      execute: async () => [],
      select: async () => [],
    }),
  };
}

export const checkTauri = () => isTauri;

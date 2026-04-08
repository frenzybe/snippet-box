export interface Translations {
  search: {
    placeholder: string;
    noResults: string;
    addHint: string;
    clear: string;
  };
  editor: {
    selectHint: string;
    copy: string;
    copied: string;
    edit: string;
    delete: string;
    fillCopy: string;
    language: string;
    tabs: {
      snippet: string;
      help: string;
    };
  };
  template: {
    badge: string;
    hint: string;
    hint2: string;
    filled: string;
    preview: string;
  };
  form: {
    newTitle: string;
    editTitle: string;
    titlePlaceholder: string;
    tagsPlaceholder: string;
    langPlaceholder: string;
    codePlaceholder: string;
    save: string;
    saveChanges: string;
    templateDetected: string;
    addFile: string;
    deleteFile: string;
    filename: string;
  };
  templateModal: {
    title: string;
    hint: string;
    copyClose: string;
    enterValue: string;
  };
  tags: {
    all: string;
    label: string;
  };
  settings: {
    title: string;
    language: string;
    theme: string;
    themeLight: string;
    themeDark: string;
    hotkey: string;
    hotkeyHint: string;
    openSettings: string;
    sections: {
      appearance: string;
      interaction: string;
      backup: string;
    };
    backup: {
      exportTitle: string;
      exportDesc: string;
      exportBtn: string;
      importTitle: string;
      importDesc: string;
      importBtn: string;
    };
  };
  nav: {
    favorites: string;
    create: string;
    settings: string;
  };
  help: {
    subtitle: string;
    sections: {
      search: string;
      templates: string;
      managing: string;
      shortcuts: string;
      system: string;
      appearance: string;
      data: string;
    };
    docs: {
      icon: string;
      title: string;
      items: { label: string; desc: string }[];
    }[];
  };
  empty: {
    noFavorites: string;
    noFavoritesDesc: string;
    noSelected: string;
    noSelectedDesc: string;
  };
}

export const en: Translations = {
  search: {
    placeholder: 'Search snippets… (↑↓ navigate, ⏎ copy)',
    noResults: 'No snippets found',
    addHint: 'Click + to add snippets',
    clear: 'Clear search',
  },
  editor: {
    selectHint: 'Select a snippet to view',
    copy: 'Copy',
    copied: 'Copied!',
    edit: 'Edit snippet',
    delete: 'Delete snippet',
    fillCopy: 'Fill & Copy',
    language: 'Language',
    tabs: {
      snippet: 'Snippet',
      help: 'Help',
    },
  },
  template: {
    badge: '✨ Template',
    hint: 'Hover over',
    hint2: 'in the code to fill them in',
    filled: 'filled',
    preview: 'Preview',
  },
  form: {
    newTitle: 'New Snippet',
    editTitle: 'Edit Snippet',
    titlePlaceholder: 'Title (e.g. React useCallback)',
    tagsPlaceholder: 'Tags (comma separated, e.g. react, hooks)',
    langPlaceholder: 'Language',
    codePlaceholder: 'Paste or type your snippet here...',
    save: 'Save Snippet',
    saveChanges: 'Save Changes',
    templateDetected: '✨ Template variables detected:',
    addFile: 'Add File',
    deleteFile: 'Delete File',
    filename: 'Filename',
  },
  templateModal: {
    title: 'Fill in variables',
    hint: 'This snippet contains template variables. Fill them in and press Save.',
    copyClose: 'Copy & Close',
    enterValue: 'Enter value for',
  },
  tags: {
    all: 'All',
    label: 'Template variables',
  },
  settings: {
    title: 'Settings',
    language: 'Language',
    theme: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    hotkey: 'Global Shortcut',
    hotkeyHint: 'Show/hide app from anywhere',
    openSettings: 'Settings',
    sections: {
      appearance: 'Appearance',
      interaction: 'Interaction',
      backup: 'Backup & Restore',
    },
    backup: {
      exportTitle: 'Export Snippets',
      exportDesc: 'Save all snippets to a JSON file',
      exportBtn: 'Export',
      importTitle: 'Import Snippets',
      importDesc: 'Restore from a previously exported JSON',
      importBtn: 'Import',
    },
  },
  nav: {
    favorites: 'Show Favorites',
    create: 'Create Snippet',
    settings: 'Settings',
  },
  help: {
    subtitle: 'Everything you need to know about Snippet Box',
    sections: {
      search: 'Search & Navigation',
      templates: 'Template Variables',
      managing: 'Managing Snippets',
      shortcuts: 'Keyboard Shortcuts',
      system: 'System Tray',
      appearance: 'Appearance',
      data: 'Data & Storage',
    },
    docs: [
      {
        icon: '🔍',
        title: 'Search & Navigation',
        items: [
          { label: '↑ / ↓', desc: 'Navigate between snippets in the list' },
          { label: '⏎ Enter', desc: 'Copy the selected snippet to clipboard' },
          { label: 'Type anything', desc: 'Instantly filter snippets by title or tags' },
          { label: 'Click a tag pill', desc: 'Filter snippets by that tag (click again to clear)' },
        ],
      },
      {
        icon: '✨',
        title: 'Template Variables',
        items: [
          { label: '{{variable}}', desc: 'Wrap any word in double curly braces to make it a template variable' },
          { label: 'Hover over variable', desc: 'A tooltip appears where you can type the value — the preview updates live' },
          { label: 'Preview panel', desc: 'Shows the resolved code with all variables filled in. Drag the top edge to resize it, or click ∨ to collapse' },
          { label: 'Copy button', desc: 'Copies the resolved code (with variables substituted) to clipboard' },
        ],
      },
      {
        icon: '📋',
        title: 'Managing Snippets',
        items: [
          { label: '+ button', desc: 'Opens the creation modal. Fill in title, tags, language and code' },
          { label: '✏️ Edit (pencil)', desc: 'Re-opens the form pre-filled with the current snippet data' },
          { label: '🗑 Delete (trash)', desc: 'Permanently deletes the snippet' },
          { label: 'Tags field', desc: 'Comma-separated list, e.g. "react, hooks, ui". Used for filtering' },
          { label: 'Language selector', desc: '14 languages with syntax highlighting: JS, TS, Python, Rust, Go, Bash, SQL, and more' },
        ],
      },
      {
        icon: '⌨️',
        title: 'Keyboard Shortcuts',
        items: [
          { label: 'Cmd + Shift + X', desc: 'Global hotkey — show / hide Snippet Box from anywhere on your Mac' },
          { label: 'Esc', desc: 'Close the current modal or form' },
          { label: '⌘ + W', desc: 'Hide the window (stays in tray)' },
        ],
      },
      {
        icon: '🖥',
        title: 'System Tray',
        items: [
          { label: 'Tray icon (menu bar)', desc: 'Left-click to show/hide the window. Right-click for a context menu' },
          { label: 'Close button (✕)', desc: 'Hides the window — the app keeps running in the tray' },
          { label: 'Quit', desc: 'Right-click the tray icon → Quit Snippet Box to fully exit' },
        ],
      },
      {
        icon: '🎨',
        title: 'Appearance',
        items: [
          { label: '☀️ / 🌑 Theme toggle', desc: 'Switch between Light and Dark mode. Your choice is remembered' },
          { label: '🌐 Language toggle', desc: 'Switch between English and Russian interface. Saved automatically' },
          { label: '⤢ Maximize', desc: 'Expand the window. On macOS, use the native green button for true fullscreen' },
        ],
      },
      {
        icon: '💾',
        title: 'Data & Storage',
        items: [
          { label: 'Auto-save', desc: 'Every change (add, edit, delete) is immediately saved to a local JSON store' },
          { label: 'Storage location', desc: '~/Library/Application Support/com.snippetbox.app/snippets.json' },
          { label: 'No cloud required', desc: 'Everything is stored locally on your Mac — works offline' },
        ],
      },
    ],
  },
  empty: {
    noFavorites: 'No Favorites Yet',
    noFavoritesDesc: 'Star your most used snippets to see them here.',
    noSelected: 'No Snippet Selected',
    noSelectedDesc: 'Select a snippet from the list or create a new one to start editing.',
  },
};

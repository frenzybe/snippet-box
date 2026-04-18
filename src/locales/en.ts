export interface Translations {
  search: {
    placeholder: string;
    noResults: string;
    noResultsDesc: string;
    addHint: string;
    addHintDesc: string;
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
      history: string;
    };
    history: {
      noHistory: string;
      noHistoryDesc: string;
      confirmRestore: string;
      confirmDelete: string;
    };
  };
  template: {
    badge: string;
    hint: string;
    hint2: string;
    filled: string;
    preview: string;
  };
  snippetForm: {
    title: string;
    editTitle: string;
    titleLabel: string;
    titlePlaceholder: string;
    tagsLabel: string;
    tagsPlaceholder: string;
    fileOptions: string;
    filenameLabel: string;
    languageLabel: string;
    codePlaceholder: string;
    addFile: string;
    deleteFile: string;
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
    lineWrapping: string;
    hideOnCopy: string;
    iconStyle: string;
    iconPacks: {
      brand: string;
      classic: string;
      minimal: string;
    };
    openSettings: string;
    sections: {
      appearance: string;
      interaction: string;
      editor: string;
      backup: string;
      danger: string;
    };
    fontSize: string;
    showLineNumbers: string;
    tabSize: string;
    highlightActiveLine: string;
    danger: {
      resetTitle: string;
      resetDesc: string;
      resetBtn: string;
      confirmMsg: string;
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
    noFolderSnippets: string;
    noFolderSnippetsDesc: string;
    noLanguageSnippets: string;
    noLanguageSnippetsDesc: string;
  };
  sidebar: {
    library: string;
    allSnippets: string;
    favorites: string;
    recentlyUpdated: string;
    languages: string;
    snippets: string;
    selected: string;
    bulkDeleteTitle: string;
    bulkDeleteConfirm: string;
    deleteConfirm: string;
  };
  common: {
    save: string;
    cancel: string;
    edit: string;
    diffPreview: string;
    on: string;
    off: string;
    loading: string;
    restore: string;
    settings: string;
    delete: string;
    clearAll: string;
    confirmClearAll: string;
    versionsCount: string;
    showAll: string;
    error: string;
    duplicate: string;
    version: string;
  };
  toasts: {
    copied: string;
    created: string;
    updated: string;
    deleted: string;
    bulkDeleted: string;
    favAdded: string;
    favRemoved: string;
    imported: string;
    exported: string;
    error: string;
    fillTitle: string;
    fillFilename: string;
    fillCode: string;
    noFavoritesYet: string;
  };
  export: {
    title: string;
    tabs: {
      background: string;
      editor: string;
      config: string;
    };
    background: {
      library: string;
      myLibrary: string;
      presets: string;
      solid: string;
      gradient: string;
      start: string;
      end: string;
      angle: string;
      addToLib: string;
    };
    editor: {
      fontSize: string;
      lineNumbers: string;
      lineWrap: string;
    };
    config: {
      outerSpace: string;
      windowStyle: string;
      cornerRadius: string;
      shadowIntensity: string;
      markdownView: string;
      markdownCode: string;
      markdownPreview: string;
      previewZoom: string;
    };
    actions: {
      copy: string;
      copied: string;
      download: string;
      exporting: string;
    };
    toasts: {
      copySuccess: string;
      copyError: string;
      saveSuccess: string;
      saveError: string;
    };
  };
  folders: {
    title: string;
    create: string;
    rename: string;
    delete: string;
    deleteConfirm: string;
    addToFolder: string;
    removeFromFolder: string;
    noFolders: string;
    namePlaceholder: string;
    color: string;
    snippetAdded: string;
    snippetRemoved: string;
  };
}

export const en: Translations = {
  search: {
    placeholder: 'Search snippets… (↑↓ navigate, ⏎ copy)',
    noResults: 'No snippets found',
    noResultsDesc: 'Try a different keyword or filter',
    addHint: 'Click + to add snippets',
    addHintDesc: 'Start by creating your first code snippet',
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
      history: 'History',
    },
    history: {
      noHistory: 'No previous versions found.',
      noHistoryDesc: 'History is created automatically when you update a snippet.',
      confirmRestore: 'Are you sure you want to restore this version? Your current state will be saved to history.',
      confirmDelete: 'Are you sure you want to delete this history version?',
    },
  },
  template: {
    badge: '✨ Template',
    hint: 'Hover over',
    hint2: 'in the code to fill them in',
    filled: 'filled',
    preview: 'Preview',
  },
  snippetForm: {
    title: 'New Snippet',
    editTitle: 'Edit Snippet',
    titleLabel: 'Snippet Title',
    titlePlaceholder: 'Title (e.g. React useCallback)',
    tagsLabel: 'Tags',
    tagsPlaceholder: 'Tags (comma separated, e.g. react, hooks)',
    fileOptions: 'File Options',
    filenameLabel: 'Filename',
    languageLabel: 'Language',
    codePlaceholder: 'Paste or type your snippet here...',
    addFile: 'Add File',
    deleteFile: 'Delete File',
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
    hotkeyHint: 'Show/hide app from anywhere ({modIcon}ShiftX)',
    lineWrapping: 'Line Wrapping',
    hideOnCopy: 'Hide after copy',
    iconStyle: 'Icon Style',
    iconPacks: {
      brand: 'Brands',
      classic: 'Classic',
      minimal: 'Minimal',
    },
    openSettings: 'Settings',
    sections: {
      appearance: 'Appearance',
      interaction: 'Interaction',
      editor: 'Editor',
      backup: 'Backup & Restore',
      danger: 'Danger Zone',
    },
    fontSize: 'Font Size',
    showLineNumbers: 'Show Line Numbers',
    tabSize: 'Tab Size',
    highlightActiveLine: 'Highlight Active Line',
    danger: {
      resetTitle: 'Reset All Data',
      resetDesc: 'Permanently deletes all snippets and resets settings to default. App will restart.',
      resetBtn: 'Reset Everything',
      confirmMsg: 'Are you sure you want to reset all data? This action cannot be undone.',
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
          { label: '⏎ Enter', desc: 'Quickly copy the selected snippet to clipboard' },
          { label: 'Smart Search', desc: 'Instantly filter snippets by title or tags as you type' },
          { label: 'Tag Pills', desc: 'Click a tag in the editor or sidebar to filter by it (click again to clear)' },
        ],
      },
      {
        icon: '✨',
        title: 'Template Variables',
        items: [
          { label: '{{variable}}', desc: 'Wrap any word in double curly braces to create a dynamic input field' },
          { label: 'Live Preview', desc: 'Hover over a variable in code to fill it. The preview updates in real-time' },
          { label: 'Fill & Copy', desc: 'Fill all variables and hit Copy to get the resolved code with your values' },
        ],
      },
      {
        icon: '📋',
        title: 'Managing Snippets',
        items: [
          { label: '+ Button', desc: 'Opens the creation modal. You can add multiple files to a single snippet' },
          { label: '✏️ Edit', desc: 'Modify your snippets, change languages, or add/remove tags' },
          { label: '🗑 Delete', desc: 'Permanently removes the snippet from your local database' },
        ],
      },
      {
        icon: '⌨️',
        title: 'Global Shortcuts',
        items: [
          { label: '{mod} + Shift + X', desc: 'Global activation — show or hide the app from anywhere on your {osName}' },
          { label: 'Esc', desc: 'Quickly close any modal or the entire app window' },
          { label: '{mod} + W', desc: 'Minimize the window to the System Tray background' },
        ],
      },
      {
        icon: '💾',
        title: 'Data & Backup',
        items: [
          { label: 'Export', desc: 'Download all your snippets as a portable JSON file for backup' },
          { label: 'Import', desc: 'Restore your snippets from a previously exported JSON file' },
          { label: 'Offline First', desc: 'All data is stored locally in {storagePath} — no cloud needed' },
        ],
      },
      {
        icon: '🖥',
        title: 'System Integration',
        items: [
          { label: 'System Tray', desc: 'The app stays alive in your menu bar/system tray even when closed' },
          { label: 'Auto-Update', desc: 'Snippet Box checks for updates and handles data sync automatically' },
        ],
      },
    ],
  },
  empty: {
    noFavorites: 'No Favorites Yet',
    noFavoritesDesc: 'Star your most used snippets to see them here.',
    noSelected: 'No Snippet Selected',
    noSelectedDesc: 'Select a snippet from the list or create a new one to start editing.',
    noFolderSnippets: 'Folder is empty',
    noFolderSnippetsDesc: 'Add snippets to this folder by clicking the folder icon on any snippet in the list.',
    noLanguageSnippets: 'No {lang} snippets yet',
    noLanguageSnippetsDesc: 'Create a new snippet and add a {lang} file to see it here.',
  },
  sidebar: {
    library: 'Library',
    allSnippets: 'All Snippets',
    favorites: 'Favorites',
    recentlyUpdated: 'Recently Updated',
    languages: 'Languages',
    snippets: 'Snippets ({count})',
    selected: 'selected',
    bulkDeleteTitle: 'Delete Snippets',
    bulkDeleteConfirm: 'Are you sure you want to delete {count} snippets? This action cannot be undone.',
    deleteConfirm: 'Are you sure you want to delete this snippet? This action cannot be undone.',
  },
  common: {
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    diffPreview: 'Diff Preview',
    on: 'On',
    off: 'Off',
    loading: 'Loading...',
    restore: 'Restore Version',
    settings: 'Settings',
    delete: 'Delete',
    clearAll: 'Clear All History',
    confirmClearAll: 'Are you sure you want to delete ALL history for this snippet?',
    versionsCount: 'versions',
    showAll: 'Show All Snippets',
    error: 'Error',
    duplicate: 'Duplicate',
    version: 'Version',
  },
  toasts: {
    copied: 'Snippet copied to clipboard',
    created: 'New snippet created',
    updated: 'Snippet updated successfully',
    deleted: 'Snippet deleted',
    bulkDeleted: '{count} snippets deleted',
    favAdded: 'Added to favorites',
    favRemoved: 'Removed from favorites',
    imported: 'Snippets imported successfully',
    exported: 'Snippets exported successfully',
    error: 'Something went wrong',
    fillTitle: 'Please enter a snippet title',
    fillFilename: 'Please enter a filename',
    fillCode: 'Please add snippet code',
    noFavoritesYet: 'No favorites to show! Star some snippets first.',
  },
  export: {
    title: 'Export Snippet',
    tabs: {
      background: 'Background',
      editor: 'Editor',
      config: 'Config',
    },
    background: {
      library: 'Library',
      myLibrary: 'My Library',
      presets: 'Presets',
      solid: 'Solid',
      gradient: 'Gradient',
      start: 'Start',
      end: 'End',
      angle: 'Angle',
      addToLib: 'Add to Library',
    },
    editor: {
      fontSize: 'Font Size',
      lineNumbers: 'Line Numbers',
      lineWrap: 'Line Wrap',
    },
    config: {
      outerSpace: 'Outer Space',
      windowStyle: 'Window Style',
      cornerRadius: 'Corner Radius',
      shadowIntensity: 'Shadow Intensity',
      markdownView: 'Markdown View',
      markdownCode: 'CODE',
      markdownPreview: 'PREVIEW',
      previewZoom: 'Preview Zoom',
    },
    actions: {
      copy: 'Copy',
      copied: 'Copied!',
      download: 'Download',
      exporting: 'Exporting...',
    },
    toasts: {
      copySuccess: 'Image copied to clipboard!',
      copyError: 'Failed to copy image',
      saveSuccess: 'Image saved successfully!',
      saveError: 'Failed to save image',
    },
  },
  folders: {
    title: 'Folders',
    create: 'New Folder',
    rename: 'Rename',
    delete: 'Delete Folder',
    deleteConfirm: 'Delete this folder? Snippets inside will not be deleted.',
    addToFolder: 'Add to Folder',
    removeFromFolder: 'Remove from Folder',
    noFolders: 'No folders yet',
    namePlaceholder: 'Folder name...',
    color: 'Color',
    snippetAdded: 'Snippet added to folder',
    snippetRemoved: 'Snippet removed from folder',
  },
};

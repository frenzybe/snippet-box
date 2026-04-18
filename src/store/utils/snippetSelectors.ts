import { SnippetState } from '../../types/store';

export const selectFilteredSnippets = (state: SnippetState, folderSnippetIds: Record<string, string[]> = {}) => {
  const snippets = state.snippets || [];
  const searchResults = state.searchResults;
  const query = state.searchQuery.toLowerCase().trim();

  return snippets.filter((s) => {
    if (!s) return false;

    if (query) {
      const isFoundByFTS = searchResults?.includes(s.id);
      const matchesMetaLocally =
        s.title.toLowerCase().includes(query) ||
        (s.tags || []).some(t => t.toLowerCase().includes(query));

      if (!isFoundByFTS && !matchesMetaLocally) return false;
    }

    const matchesTag = !state.activeTag || (s.tags || []).includes(state.activeTag);

    let matchesCollection = true;
    if (state.activeCollection === 'favorites') {
      matchesCollection = !!s.isFavorite;
    } else if (state.activeCollection === 'recent') {
      matchesCollection = true;
    } else if (state.activeCollection.startsWith('folder:')) {
      const folderId = state.activeCollection.replace('folder:', '');
      const allowedIds = folderSnippetIds[folderId] || [];
      matchesCollection = allowedIds.includes(s.id);
    } else if (state.activeCollection !== 'all') {
      matchesCollection = s.files.some(f => f.language.toLowerCase() === state.activeCollection.toLowerCase());
    }

    return matchesTag && matchesCollection;
  });
};

export const selectSortedSnippets = (state: SnippetState, folderSnippetIds: Record<string, string[]> = {}) => {
  const filtered = selectFilteredSnippets(state, folderSnippetIds);
  const activeCollection = state.activeCollection;

  return [...filtered].sort((a, b) => {
    if (activeCollection === 'recent') {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    return a.title.localeCompare(b.title);
  });
};

export const selectAllTags = (state: SnippetState) => state.allTags;
export const selectLanguages = (state: SnippetState) => state.allLanguages;

let lastSnippets: any[] | null = null;
let lastFolderIds: Record<string, string[]> | null = null;
let lastCounts: any = null;

export const selectCounts = (state: SnippetState, folderSnippetIds: Record<string, string[]>) => {
  const snippets = state.snippets || [];

  if (snippets === lastSnippets && folderSnippetIds === lastFolderIds && lastCounts) {
    return lastCounts;
  }

  const counts = {
    all: snippets.length,
    favorites: snippets.filter(s => s.isFavorite).length,
    recent: snippets.filter(s => {
      const someDate = new Date(s.updatedAt);
      const now = new Date();
      return (now.getTime() - someDate.getTime()) < 7 * 24 * 60 * 60 * 1000; // Last 7 days
    }).length,
    folders: {} as Record<string, number>,
    languages: {} as Record<string, number>
  };

  Object.keys(folderSnippetIds).forEach(folderId => {
    counts.folders[folderId] = (folderSnippetIds[folderId] || []).length;
  });

  snippets.forEach(s => {
    s.files.forEach(f => {
      const lang = f.language.toLowerCase();
      counts.languages[lang] = (counts.languages[lang] || 0) + 1;
    });
  });

  lastSnippets = snippets;
  lastFolderIds = folderSnippetIds;
  lastCounts = counts;

  return counts;
};

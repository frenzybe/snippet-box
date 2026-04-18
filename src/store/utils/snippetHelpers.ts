import { Snippet } from '../../types';

export const getMetadata = (snippets: Snippet[]) => {
  const tags = new Set<string>();
  const langs = new Set<string>();

  snippets.forEach(s => {
    if (s.tags) s.tags.forEach(t => tags.add(t));
    if (s.files) s.files.forEach(f => {
      if (f.language) langs.add(f.language);
    });
  });

  return {
    allTags: Array.from(tags).sort(),
    allLanguages: Array.from(langs).sort()
  };
};

import { v4 as uuidv4 } from 'uuid';
import Database from '@tauri-apps/plugin-sql';
import { DbCore } from './core';
import { Snippet } from '../../types';

async function _saveSnippet(db: Database, snippet: Snippet) {
  const existingRows = await db.select<any[]>('SELECT * FROM snippets WHERE id = $1', [snippet.id]);
  if (existingRows.length > 0) {
    const existing = existingRows[0];
    const files = await db.select<any[]>('SELECT * FROM files WHERE snippet_id = $1', [snippet.id]);
    const tagsRows = await db.select<any[]>(`
      SELECT t.name FROM snippet_tags st 
      JOIN tags t ON st.tag_id = t.id
      WHERE st.snippet_id = $1
    `, [snippet.id]);

    const snapshot = {
      ...existing,
      isFavorite: !!existing.is_favorite,
      isTemplate: !!existing.is_template,
      createdAt: Number(existing.created_at),
      updatedAt: Number(existing.updated_at),
      files,
      tags: tagsRows.map(t => t.name)
    };

    await db.execute(
      'INSERT INTO snippet_history (id, snippet_id, data, created_at) VALUES ($1, $2, $3, $4)',
      [uuidv4(), snippet.id, JSON.stringify(snapshot), new Date().toISOString()]
    );
  }

  await db.execute(
    `INSERT INTO snippets (id, title, description, is_favorite, is_template, created_at, updated_at) 
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      description = excluded.description,
      is_favorite = excluded.is_favorite,
      is_template = excluded.is_template,
      updated_at = excluded.updated_at`,
    [
      snippet.id, snippet.title, snippet.description || '',
      snippet.isFavorite ? 1 : 0, snippet.isTemplate ? 1 : 0,
      snippet.createdAt.toString(), snippet.updatedAt.toString()
    ]
  );

  await db.execute('DELETE FROM files WHERE snippet_id = $1', [snippet.id]);
  let combinedContent = '';
  for (const file of snippet.files) {
    await db.execute(
      'INSERT INTO files (id, snippet_id, filename, code, language) VALUES ($1, $2, $3, $4, $5)',
      [file.id, snippet.id, file.filename, file.code, file.language]
    );
    combinedContent += ` ${file.filename} ${file.code}`;
  }

  const ftsContent = `${snippet.title} ${snippet.description || ''} ${combinedContent}`.trim();
  await db.execute('DELETE FROM snippets_fts WHERE snippet_id = $1', [snippet.id]);
  await db.execute(
    'INSERT INTO snippets_fts (snippet_id, title, description, content) VALUES ($1, $2, $3, $4)',
    [snippet.id, snippet.title, snippet.description || '', ftsContent]
  );

  await db.execute('DELETE FROM snippet_tags WHERE snippet_id = $1', [snippet.id]);
  for (const tagName of snippet.tags) {
    await db.execute('INSERT OR IGNORE INTO tags (name) VALUES ($1)', [tagName]);
    const tagRow = await db.select<{ id: number }[]>('SELECT id FROM tags WHERE name = $1', [tagName]);
    if (tagRow.length > 0) {
      await db.execute(
        'INSERT OR REPLACE INTO snippet_tags (snippet_id, tag_id) VALUES ($1, $2)',
        [snippet.id, tagRow[0].id]
      );
    }
  }
}

async function _deleteSnippet(db: Database, id: string) {
  await db.execute('DELETE FROM snippets WHERE id = $1', [id]);
}

export const snippetService = {
  async getAllSnippets(): Promise<Snippet[]> {
    return DbCore.withLock(async (db) => {
      const rows = await db.select<any[]>('SELECT * FROM snippets ORDER BY created_at DESC');
      if (rows.length === 0) return [];

      const allFiles = await db.select<any[]>('SELECT id, snippet_id, filename, language FROM files');
      const allSnippetTags = await db.select<any[]>(`
        SELECT st.snippet_id, t.name 
        FROM snippet_tags st 
        JOIN tags t ON st.tag_id = t.id
      `);

      const filesMap = new Map<string, any[]>();
      allFiles.forEach(f => {
        if (!filesMap.has(f.snippet_id)) filesMap.set(f.snippet_id, []);
        filesMap.get(f.snippet_id)!.push(f);
      });

      const tagsMap = new Map<string, string[]>();
      allSnippetTags.forEach(st => {
        if (!tagsMap.has(st.snippet_id)) tagsMap.set(st.snippet_id, []);
        tagsMap.get(st.snippet_id)!.push(st.name);
      });

      return rows.map(s => ({
        id: s.id,
        title: s.title,
        description: s.description,
        isFavorite: !!s.is_favorite,
        isTemplate: !!s.is_template,
        createdAt: Number(s.created_at),
        updatedAt: Number(s.updated_at),
        files: (filesMap.get(s.id) || []).map(f => ({
          id: f.id,
          filename: f.filename,
          code: '',
          language: f.language
        })),
        tags: tagsMap.get(s.id) || []
      }));
    });
  },

  async getSnippetFiles(snippetId: string): Promise<any[]> {
    return DbCore.withLock(async (db) => {
      const files = await db.select<any[]>('SELECT * FROM files WHERE snippet_id = $1', [snippetId]);
      return files.map(f => ({
        id: f.id,
        filename: f.filename,
        code: f.code,
        language: f.language
      }));
    });
  },

  async getSnippetById(id: string): Promise<Snippet | null> {
    return DbCore.withLock(async (db) => {
      const rows = await db.select<any[]>('SELECT * FROM snippets WHERE id = $1', [id]);
      if (rows.length === 0) return null;

      const s = rows[0];
      const files = await db.select<any[]>('SELECT * FROM files WHERE snippet_id = $1', [id]);
      const tags = await db.select<any[]>(`
        SELECT t.name FROM snippet_tags st 
        JOIN tags t ON st.tag_id = t.id
        WHERE st.snippet_id = $1
      `, [id]);

      return {
        id: s.id,
        title: s.title,
        description: s.description,
        isFavorite: !!s.is_favorite,
        isTemplate: !!s.is_template,
        createdAt: Number(s.created_at),
        updatedAt: Number(s.updated_at),
        files: files.map(f => ({
          id: f.id,
          filename: f.filename,
          code: f.code,
          language: f.language
        })),
        tags: tags.map(t => t.name)
      };
    });
  },

  async saveSnippet(snippet: Snippet, useTransaction = true) {
    if (useTransaction) {
      return DbCore.transaction(async (db) => _saveSnippet(db, snippet));
    } else {
      return DbCore.withLock(async (db) => _saveSnippet(db, snippet));
    }
  },

  async bulkSaveSnippets(snippets: Snippet[]) {
    return DbCore.transaction(async (db) => {
      for (const s of snippets) {
        await _saveSnippet(db, s);
      }
    });
  },

  async deleteSnippet(id: string) {
    return DbCore.withLock(async (db) => _deleteSnippet(db, id));
  },

  async bulkDeleteSnippets(ids: string[]) {
    return DbCore.transaction(async (db) => {
      for (const id of ids) {
        await _deleteSnippet(db, id);
      }
    });
  },

  async bulkToggleFavorite(ids: string[], favorite: boolean) {
    return DbCore.transaction(async (db) => {
      const val = favorite ? 1 : 0;
      for (const id of ids) {
        await db.execute('UPDATE snippets SET is_favorite = $1 WHERE id = $2', [val, id]);
      }
    });
  },

  async searchSnippets(query: string): Promise<string[]> {
    return DbCore.withLock(async (db) => {
      if (!query) return [];
      const results = await db.select<{ snippet_id: string }[]>(
        'SELECT snippet_id FROM snippets_fts WHERE snippets_fts MATCH $1',
        [`${query}*`]
      );
      return results.map(r => r.snippet_id);
    });
  },

  async resetAllData() {
    return DbCore.transaction(async (db) => {
      await db.execute('DELETE FROM snippets');
      await db.execute('DELETE FROM tags');
      await db.execute('DELETE FROM snippets_fts');
      await db.execute('DELETE FROM snippet_history');
      await db.execute('DELETE FROM folders');
    });
  },

  async getBackupData() {
    return DbCore.withLock(async (db) => {
      const snippets = await db.select<any[]>('SELECT * FROM snippets');
      const files = await db.select<any[]>('SELECT * FROM files');
      const tags = await db.select<any[]>(`
        SELECT st.snippet_id, t.name 
        FROM snippet_tags st 
        JOIN tags t ON st.tag_id = t.id
      `);
      const history = await db.select<any[]>('SELECT * FROM snippet_history');

      const filesMap = new Map<string, any[]>();
      files.forEach(f => {
        if (!filesMap.has(f.snippet_id)) filesMap.set(f.snippet_id, []);
        filesMap.get(f.snippet_id)!.push(f);
      });

      const tagsMap = new Map<string, string[]>();
      tags.forEach(st => {
        if (!tagsMap.has(st.snippet_id)) tagsMap.set(st.snippet_id, []);
        tagsMap.get(st.snippet_id)!.push(st.name);
      });

      const fullSnippets: Snippet[] = snippets.map(s => ({
        id: s.id,
        title: s.title,
        description: s.description,
        isFavorite: !!s.is_favorite,
        isTemplate: !!s.is_template,
        createdAt: Number(s.created_at),
        updatedAt: Number(s.updated_at),
        files: (filesMap.get(s.id) || []).map(f => ({
          id: f.id,
          filename: f.filename,
          code: f.code,
          language: f.language
        })),
        tags: tagsMap.get(s.id) || []
      }));

      return {
        snippets: fullSnippets,
        history
      };
    });
  },

  async bulkImportHistory(entries: any[]) {
    return DbCore.transaction(async (db) => {
      for (const entry of entries) {
        await db.execute(
          'INSERT OR REPLACE INTO snippet_history (id, snippet_id, data, created_at) VALUES ($1, $2, $3, $4)',
          [entry.id, entry.snippet_id, entry.data, entry.created_at]
        );
      }
    });
  }
};

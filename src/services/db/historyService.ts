import { DbCore } from './core';

export const historyService = {
  async getSnippetHistory(snippetId: string): Promise<any[]> {
    return DbCore.withLock(async (db) => {
      const rows = await db.select<any[]>('SELECT * FROM snippet_history WHERE snippet_id = $1 ORDER BY created_at DESC', [snippetId]);
      return rows.map(r => ({
        historyId: r.id,
        createdAt: r.createdAt,
        snippet: JSON.parse(r.data)
      }));
    });
  },

  async deleteSnippetHistoryEntry(historyId: string): Promise<void> {
    await DbCore.withLock(async (db) => {
      await db.execute('DELETE FROM snippet_history WHERE id = $1', [historyId]);
    });
  },

  async clearSnippetHistory(snippetId: string): Promise<void> {
    await DbCore.withLock(async (db) => {
      await db.execute('DELETE FROM snippet_history WHERE snippet_id = $1', [snippetId]);
    });
  }
};

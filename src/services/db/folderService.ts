import { DbCore } from './core';
import Database from '@tauri-apps/plugin-sql';

async function _saveFolder(db: Database, folder: { id: string; name: string; color: string; createdAt: number; updatedAt: number }) {
  await db.execute(
    `INSERT INTO folders (id, name, color, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      color = excluded.color,
      updated_at = excluded.updated_at`,
    [folder.id, folder.name, folder.color, folder.createdAt.toString(), folder.updatedAt.toString()]
  );
}

async function _deleteFolder(db: Database, id: string) {
  await db.execute('DELETE FROM folders WHERE id = $1', [id]);
}

async function _addSnippetToFolder(db: Database, snippetId: string, folderId: string) {
  await db.execute(
    'INSERT OR IGNORE INTO snippet_folders (snippet_id, folder_id) VALUES ($1, $2)',
    [snippetId, folderId]
  );
}

export const folderService = {
  async getFolders() {
    return DbCore.withLock(async (db) => {
      const rows = await db.select<any[]>('SELECT * FROM folders ORDER BY name ASC');
      return rows.map(r => ({
        id: r.id,
        name: r.name,
        color: r.color,
        createdAt: Number(r.created_at),
        updatedAt: Number(r.updated_at)
      }));
    });
  },

  async saveFolder(folder: { id: string; name: string; color: string; createdAt: number; updatedAt: number }) {
    await DbCore.withLock(async (db) => _saveFolder(db, folder));
  },

  async deleteFolder(id: string) {
    await DbCore.withLock(async (db) => _deleteFolder(db, id));
  },

  async addSnippetToFolder(snippetId: string, folderId: string) {
    await DbCore.withLock(async (db) => _addSnippetToFolder(db, snippetId, folderId));
  },

  async removeSnippetFromFolder(snippetId: string, folderId: string) {
    await DbCore.withLock(async (db) => {
      await db.execute(
        'DELETE FROM snippet_folders WHERE snippet_id = $1 AND folder_id = $2',
        [snippetId, folderId]
      );
    });
  },

  async getSnippetIdsByFolder(folderId: string): Promise<string[]> {
    return DbCore.withLock(async (db) => {
      const rows = await db.select<{ snippet_id: string }[]>(
        'SELECT snippet_id FROM snippet_folders WHERE folder_id = $1',
        [folderId]
      );
      return rows.map(r => r.snippet_id);
    });
  },

  async getAllFolderAssignments(): Promise<Record<string, string[]>> {
    return DbCore.withLock(async (db) => {
      const rows = await db.select<any[]>('SELECT * FROM snippet_folders');
      const map: Record<string, string[]> = {};
      rows.forEach(r => {
        if (!map[r.folder_id]) map[r.folder_id] = [];
        map[r.folder_id].push(r.snippet_id);
      });
      return map;
    });
  },

  async bulkImportFolders(folders: any[]) {
    return DbCore.transaction(async (db) => {
      for (const f of folders) {
        await _saveFolder(db, f);
      }
    });
  },

  async bulkImportAssignments(assignmentsByFolder: Record<string, string[]>) {
    return DbCore.transaction(async (db) => {
      for (const [folderId, snippetIds] of Object.entries(assignmentsByFolder)) {
        for (const snippetId of snippetIds) {
          await _addSnippetToFolder(db, snippetId, folderId);
        }
      }
    });
  }
};

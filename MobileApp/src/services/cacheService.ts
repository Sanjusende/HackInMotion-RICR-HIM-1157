import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const initCacheDB = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('krishimitra_cache.db');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS api_cache (
        cache_key TEXT PRIMARY KEY,
        payload TEXT,
        timestamp INTEGER
      );
    `);
  }
  return db;
};

export const setCacheItem = async (key: string, data: any) => {
  try {
    const database = await initCacheDB();
    const payload = JSON.stringify(data);
    const timestamp = Date.now();
    await database.runAsync(
      'INSERT OR REPLACE INTO api_cache (cache_key, payload, timestamp) VALUES (?, ?, ?);',
      [key, payload, timestamp]
    );
  } catch (e) {
    console.warn('Cache write failed:', e);
  }
};

export const getCacheItem = async (key: string, ttlMs: number = 3600000) => {
  try {
    const database = await initCacheDB();
    const row: any = await database.getFirstAsync(
      'SELECT payload, timestamp FROM api_cache WHERE cache_key = ?;',
      [key]
    );
    if (row && Date.now() - row.timestamp < ttlMs) {
      return JSON.parse(row.payload);
    }
    return null;
  } catch (e) {
    return null;
  }
};

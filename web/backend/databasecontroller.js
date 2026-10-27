import db from './seed.js';

export const getDatabase = () => {
  return db.prepare('SELECT * FROM artist ORDER BY id ASC').all();
};

export const getTable = () => {
  return db.prepare('SELECT name FROM sqlite_master WHERE type = "table" ORDER BY name ASC').all();
};

export const getArtist = () => {
  return db.prepare('SELECT * FROM artist ORDER BY id ASC').all();
};

export const getArtistById = (id) => {
  return db.prepare('SELECT * FROM artist WHERE id = ?').get(Number(id));
};

export const getArtistsByFilter = (filters = {}) => {
  const clauses = [];
  const params = [];

  if (filters.name) {
    clauses.push('LOWER(name) LIKE ?');
    params.push(`%${String(filters.name).toLowerCase()}%`);
  }

  if (filters.genre) {
    clauses.push('LOWER(genre) LIKE ?');
    params.push(`%${String(filters.genre).toLowerCase()}%`);
  }

  if (filters.stage) {
    clauses.push('LOWER(stage) LIKE ?');
    params.push(`%${String(filters.stage).toLowerCase()}%`);
  }

  const whereClause = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const query = `SELECT * FROM artist ${whereClause} ORDER BY id ASC`;

  return db.prepare(query).all(...params);
};

export const addArtist = (artistData = {}) => {
  const stmt = db.prepare(`
    INSERT INTO artist (name, genre, stage, start_time, end_time, bio, photo_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    artistData.name ?? '',
    artistData.genre ?? '',
    artistData.stage ?? '',
    artistData.start_time ?? null,
    artistData.end_time ?? null,
    artistData.bio ?? '',
    artistData.photo_url ?? ''
  );

  return getArtistById(result.lastInsertRowid);
};

export const getLeaderboard = () => {
  return db.prepare('SELECT * FROM leaderboard ORDER BY score DESC LIMIT 10').all();
};

export const addLeaderboardEntry = (entry = {}) => {
  const stmt = db.prepare(`
    INSERT INTO leaderboard (player, score, difficulty, created_at)
    VALUES (?, ?, ?, ?)
  `);

  const result = stmt.run(
    entry.player ?? '',
    Number(entry.score ?? 0),
    entry.difficulty ?? 'medium',
    new Date().toISOString()
  );

  return db.prepare('SELECT * FROM leaderboard WHERE id = ?').get(result.lastInsertRowid);
};

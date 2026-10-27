import Database from 'better-sqlite3';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { artisten } from './artist.js';

const db = new Database(fileURLToPath(new URL('./database/Festival.db', import.meta.url)));

const createArtistTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS artist ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    genre TEXT,
    stage TEXT,
    start_time TEXT,
    end_time TEXT,
    bio TEXT,
    photo_url TEXT
  )
`);

const createLeaderboardTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player TEXT,
    score INTEGER,
    difficulty TEXT,
    created_at TEXT
  )
`);

createArtistTable.run();
createLeaderboardTable.run();

const insert = db.prepare(`
  INSERT OR IGNORE INTO artist (name, genre, stage, start_time, end_time, bio, photo_url)
  SELECT @name, @genre, @stage, @start_time, @end_time, @bio, @photo_url
  WHERE NOT EXISTS (
  SELECT 1 FROM artist WHERE name = @name
  )
`);

const insertMany = db.transaction((artists) => {
  for (const artist of artists) {
    insert.run({
      name: artist.name,
      genre: artist.genre,
      stage: artist.stage,
      start_time: artist.start_time ?? null,
      end_time: artist.end_time ?? null,
      bio: artist.bio ?? '',
      photo_url: artist.photo_url ?? '',
    });
  }
});


export const seedArtists = () => {
  insertMany(artisten);
};

const shouldSeed = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (shouldSeed) {
  seedArtists();
}

export default db;
import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dataDir = path.resolve(__dirname, '../../data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

const dbPath = path.join(dataDir, 'app.db')
export const db = new Database(dbPath)

db.pragma('journal_mode = WAL');

// 数据库表结构
db.exec(`
  CREATE TABLE IF NOT EXISTS options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    enabled INTEGER DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    nickname TEXT NOT NULL,
    password TEXT NOT NULL,
    role INTEGER DEFAULT 0,
    captcha_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    deleted INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS tracks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    artist TEXT NOT NULL,
    source TEXT NOT NULL,
    platform TEXT NOT NULL,
    importer TEXT NOT NULL,
    public INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    deleted INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS playlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    track INTEGER,
    creater TEXT NOT NULL,
    contained_at TEXT DEFAULT (datetime('now')),
    deleted INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS captchas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL,
    request_ip TEXT NOT NULL,
    requested_at TEXT DEFAULT (datetime('now')),
    deleted INTEGER DEFAULT 0
  );
`)
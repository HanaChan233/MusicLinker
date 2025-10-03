import { db } from './index.js'

// 所有方法均为同步，基于 better-sqlite3

export function select(sql, params = []) {
  try {
    return db.prepare(sql).all(params)
  } catch (err) {
    throw err
  }
}

export function insert(sql, params = []) {
  try {
    const stmt = db.prepare(sql)
    const info = stmt.run(params)
    return { lastInsertRowid: info.lastInsertRowid, changes: info.changes }
  } catch (err) {
    throw err
  }
}

export function update(sql, params = []) {
  try {
    const stmt = db.prepare(sql)
    const info = stmt.run(params)
    return { changes: info.changes }
  } catch (err) {
    throw err
  }
}

export function run(sql, params = []) {
  try {
    const stmt = db.prepare(sql)
    const info = stmt.run(params)
    return { changes: info.changes }
  } catch (err) {
    throw err
  }
}

export function fakeDelete(table, id) {
  try {
    const stmt = db.prepare(`UPDATE ${table} SET deleted = 1 WHERE id = ?`)
    const info = stmt.run(id)
    return { changes: info.changes }
  } catch (err) {
    throw err
  }
}

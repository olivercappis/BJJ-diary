import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";

const expo = openDatabaseSync("bjj-diary.db");
export const db = drizzle(expo, { schema });

export async function initializeDatabase() {
  // Create tables if they don't exist
  await expo.execAsync(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      date INTEGER NOT NULL,
      duration INTEGER NOT NULL,
      type TEXT NOT NULL,
      focus TEXT,
      intensity INTEGER,
      sparring_rounds INTEGER,
      notes TEXT,
      gym TEXT,
      instructor TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS techniques (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      position TEXT NOT NULL,
      gi_only INTEGER DEFAULT 0,
      description TEXT,
      notes TEXT,
      proficiency_level INTEGER DEFAULT 1,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tournaments (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      organization TEXT,
      date INTEGER NOT NULL,
      location TEXT,
      type TEXT NOT NULL,
      weight_class TEXT NOT NULL,
      division TEXT NOT NULL,
      belt_rank TEXT NOT NULL,
      age_class TEXT NOT NULL,
      placement INTEGER,
      total_competitors INTEGER,
      notes TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      tournament_id TEXT NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
      opponent_name TEXT,
      result TEXT NOT NULL,
      method TEXT,
      my_score INTEGER,
      opponent_score INTEGER,
      notes TEXT,
      created_at INTEGER NOT NULL
    );
  `);
}

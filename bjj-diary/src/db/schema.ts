import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  duration: integer("duration").notNull(),
  type: text("type").notNull(),
  focus: text("focus"),
  intensity: integer("intensity"),
  sparringRounds: integer("sparring_rounds"),
  notes: text("notes"),
  gym: text("gym"),
  instructor: text("instructor"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const techniques = sqliteTable("techniques", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  position: text("position").notNull(),
  giOnly: integer("gi_only", { mode: "boolean" }).default(false),
  description: text("description"),
  notes: text("notes"),
  proficiencyLevel: integer("proficiency_level").default(1),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const tournaments = sqliteTable("tournaments", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  organization: text("organization"),
  date: integer("date", { mode: "timestamp" }).notNull(),
  location: text("location"),
  type: text("type").notNull(),
  weightClass: text("weight_class").notNull(),
  division: text("division").notNull(),
  beltRank: text("belt_rank").notNull(),
  ageClass: text("age_class").notNull(),
  placement: integer("placement"),
  totalCompetitors: integer("total_competitors"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const matches = sqliteTable("matches", {
  id: text("id").primaryKey(),
  tournamentId: text("tournament_id").references(() => tournaments.id, { onDelete: "cascade" }).notNull(),
  opponentName: text("opponent_name"),
  result: text("result").notNull(),
  method: text("method"),
  myScore: integer("my_score"),
  opponentScore: integer("opponent_score"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

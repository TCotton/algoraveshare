import { sql } from "drizzle-orm"
import { pgTable, primaryKey, serial, text, timestamp, uuid } from "drizzle-orm/pg-core"
// ====================================================
// Enums (for CHECK constraints)
// ====================================================
export const audioFileTypes = ["wav", "mp3", "flac", "aac", "ogg"]
export const softwareTypes = ["strudel", "tidalcycles"]
export const entityTypes = ["project", "snippet"]
// ====================================================
// Users
// ====================================================
export const users = pgTable("users", {
  userId: uuid("user_id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(), // drizzle doesn't support citext natively, use lowercase/indexing in app
  passwordHash: text("password_hash").notNull(),
  location: text("location"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  portfolioUrl: text("portfolio_url"),
  youtubeUrl: text("youtube_url"),
  mastodonUrl: text("mastodon_url"),
  blueskyUrl: text("bluesky_url"),
  linkedinUrl: text("linkedin_url")
})
// ====================================================
// Projects
// ====================================================
export const projects = pgTable("projects", {
  projectId: uuid("project_id").primaryKey().default(sql`gen_random_uuid()`),
  projectName: text("project_name").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  codeStart: text("code_start"),
  codeEnd: text("code_end"),
  codeFull: text("code_full"),
  description: text("description").notNull(),
  audioFilePath: text("audio_file_path"),
  audioFileType: text("audio_file_type", { enum: audioFileTypes }),
  youtubeUrlId: text("youtube_url_id"),
  softwareType: text("software_type", { enum: softwareTypes }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
})
// ====================================================
// Snippets
// ====================================================
export const snippets = pgTable("snippets", {
  snippetId: uuid("snippet_id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  codeSample: text("code_sample").notNull(),
  description: text("description").notNull(),
  audioFilePath: text("audio_file_path"),
  audioFileType: text("audio_file_type", { enum: audioFileTypes }),
  softwareType: text("software_type", { enum: softwareTypes }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
})
// ====================================================
// Tags
// ====================================================
export const tags = pgTable("tags", {
  tagId: serial("tag_id").primaryKey(),
  name: text("name").notNull().unique()
})
// ====================================================
// Tag Assignments (Polymorphic relationship)
// ====================================================
export const tagAssignments = pgTable("tag_assignments", {
  tagId: serial("tag_id")
    .notNull()
    .references(() => tags.tagId, { onDelete: "cascade" }),
  entityType: text("entity_type", { enum: entityTypes }).notNull(),
  entityId: uuid("entity_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => ({
  pk: primaryKey({ columns: [table.tagId, table.entityType, table.entityId] })
}))
// # sourceMappingURL=schema.js.map

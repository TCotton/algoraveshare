import { pgTable, uuid, text, timestamp, serial, primaryKey } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ====================================================
// Enums (for CHECK constraints)
// ====================================================
export const audioFileTypes = ['wav','mp3','flac', 'm4a', 'mp4', 'ogg'] as const;
export const softwareTypes = ['strudel', 'tidalcycles'] as const;

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
    youtubeUrl: text("youtube_url"),
    mastodonUrl: text("mastodon_url"),
    blueskyUrl: text("bluesky_url"),
    linkedinUrl: text("linkedin_url"),
});

// ====================================================
// Projects
// ====================================================
export const projects = pgTable("projects", {
    projectId: uuid("project_id").primaryKey().default(sql`gen_random_uuid()`),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.userId, { onDelete: "cascade" }),
    codeStart: text("code_start").notNull(),
    codeEnd: text("code_end").notNull(),
    description: text("description"),
    audioFilePath: text("audio_file_path"),
    audioFileType: text("audio_file_type", { enum: audioFileTypes }),
    youtubeUrl: text("youtube_url"),
    softwareType: text("software_type", { enum: softwareTypes }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ====================================================
// Snippets
// ====================================================
export const snippets = pgTable("snippets", {
    snippetId: uuid("snippet_id").primaryKey().default(sql`gen_random_uuid()`),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.userId, { onDelete: "cascade" }),
    codeSample: text("code_sample").notNull(),
    description: text("description"),
    audioFilePath: text("audio_file_path"),
    audioFileType: text("audio_file_type", { enum: audioFileTypes }),
    softwareType: text("software_type", { enum: softwareTypes }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ====================================================
// Tags
// ====================================================
export const tags = pgTable("tags", {
    tagId: serial("tag_id").primaryKey(),
    name: text("name").notNull().unique(),
});

// ====================================================
// Project Tags (join table)
// ====================================================
export const projectTags = pgTable("project_tags", {
    projectId: uuid("project_id")
        .notNull()
        .references(() => projects.projectId, { onDelete: "cascade" }),
    tagId: serial("tag_id")
        .notNull()
        .references(() => tags.tagId, { onDelete: "cascade" }),
}, (table) => ({
    pk: primaryKey({ columns: [table.projectId, table.tagId] }),
}));

// ====================================================
// Snippet Tags (join table)
// ====================================================
export const snippetTags = pgTable("snippet_tags", {
    snippetId: uuid("snippet_id")
        .notNull()
        .references(() => snippets.snippetId, { onDelete: "cascade" }),
    tagId: serial("tag_id")
        .notNull()
        .references(() => tags.tagId, { onDelete: "cascade" }),
}, (table) => ({
    pk: primaryKey({ columns: [table.snippetId, table.tagId] }),
}));


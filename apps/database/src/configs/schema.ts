import { relations, sql } from 'drizzle-orm'
import { check, index, integer, jsonb, pgTable, primaryKey, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core'

// ====================================================
// Enums (for CHECK constraints)
// ====================================================
export const audioFileTypes = ['wav', 'mp3', 'flac', 'aac', 'ogg'] as const
export const softwareTypes = ['strudel', 'tidalcycles'] as const
export const entityTypes = ['project', 'snippet'] as const

// ====================================================
// Users
// ====================================================
export const users = pgTable('users', {
  userId: uuid('user_id').primaryKey().default(sql`uuid_generate_v7()`),
  name: text('name').notNull().unique(),
  email: text('email').notNull().unique(), // Using TEXT instead of CITEXT for Drizzle compatibility
  passwordHash: text('password_hash').notNull(),
  location: text('location'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  portfolioUrl: text('portfolio_url'),
  youtubeUrl: text('youtube_url'),
  mastodonUrl: text('mastodon_url'),
  blueskyUrl: text('bluesky_url'),
  linkedinUrl: text('linkedin_url')
}, (table) => ({
  nameLength: check('users_name_length', sql`char_length(${table.name}) BETWEEN 1 AND 200`),
  locationLength: check('users_location_length', sql`char_length(${table.location}) <= 200`),
  portfolioUrlPattern: check('users_portfolio_url_pattern', sql`${table.portfolioUrl} ~ '^https?://'`),
  youtubeUrlPattern: check('users_youtube_url_pattern', sql`${table.youtubeUrl} ~ '^https?://'`),
  mastodonUrlPattern: check('users_mastodon_url_pattern', sql`${table.mastodonUrl} ~ '^https?://'`),
  blueskyUrlPattern: check('users_bluesky_url_pattern', sql`${table.blueskyUrl} ~ '^https?://'`),
  linkedinUrlPattern: check('users_linkedin_url_pattern', sql`${table.linkedinUrl} ~ '^https?://'`)
}))

// ====================================================
// Projects
// ====================================================
export const projects = pgTable('projects', {
  projectId: uuid('project_id').primaryKey().default(sql`uuid_generate_v7()`),
  projectName: text('project_name').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.userId, { onDelete: 'cascade' }),
  codeStart: text('code_start'),
  codeEnd: text('code_end'),
  codeFull: text('code_full'),
  description: text('description').notNull(),
  audioFilePath: text('audio_file_path'),
  audioFileType: text('audio_file_type', { enum: audioFileTypes }),
  audioData: jsonb('audio_data'),
  youtubeUrlId: text('youtube_url_id'),
  softwareType: text('software_type', { enum: softwareTypes }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => ({
  userIdIdx: index('idx_projects_user_id').on(table.userId),
  projectNameLength: check('projects_project_name_length', sql`char_length(${table.projectName}) BETWEEN 1 AND 200`),
  audioFileTypeCheck: check(
    'projects_audio_file_type_check',
    sql`${table.audioFileType} IN ('wav', 'mp3', 'flac', 'aac', 'ogg')`
  ),
  softwareTypeCheck: check('projects_software_type_check', sql`${table.softwareType} IN ('strudel', 'tidalcycles')`)
}))

// ====================================================
// Snippets
// ====================================================
export const snippets = pgTable('snippets', {
  snippetId: uuid('snippet_id').primaryKey().default(sql`uuid_generate_v7()`),
  snippetName: text('snippet_name').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.userId, { onDelete: 'cascade' }),
  codeSample: text('code_sample').notNull(),
  description: text('description').notNull(),
  audioFilePath: text('audio_file_path'),
  audioFileType: text('audio_file_type', { enum: audioFileTypes }),
  audioData: jsonb('audio_data'),
  softwareType: text('software_type', { enum: softwareTypes }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => ({
  userIdIdx: index('idx_snippets_user_id').on(table.userId),
  snippetNameLength: check('snippets_snippet_name_length', sql`char_length(${table.snippetName}) BETWEEN 1 AND 200`),
  codeSampleLength: check('snippets_code_sample_length', sql`char_length(${table.codeSample}) <= 400`),
  audioFileTypeCheck: check(
    'snippets_audio_file_type_check',
    sql`${table.audioFileType} IN ('wav', 'mp3', 'flac', 'aac', 'ogg')`
  ),
  softwareTypeCheck: check('snippets_software_type_check', sql`${table.softwareType} IN ('strudel', 'tidalcycles')`)
}))

// ====================================================
// Tags
// ====================================================
export const tags = pgTable('tags', {
  tagId: serial('tag_id').primaryKey(),
  name: text('name').notNull().unique()
}, (table) => ({
  nameLength: check('tags_name_length', sql`char_length(${table.name}) BETWEEN 1 AND 50`)
}))

// ====================================================
// Tag Assignments (Polymorphic relationship)
// ====================================================
export const tagAssignments = pgTable('tag_assignments', {
  tagId: integer('tag_id')
    .notNull()
    .references(() => tags.tagId, { onDelete: 'cascade' }),
  entityType: text('entity_type', { enum: entityTypes }).notNull(),
  entityId: uuid('entity_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => ({
  pk: primaryKey({ columns: [table.tagId, table.entityType, table.entityId] }),
  entityIdIdx: index('idx_tag_assignments_entity_id').on(table.entityId),
  entityTypeIdx: index('idx_tag_assignments_entity_type').on(table.entityType),
  entityTypeCheck: check('tag_assignments_entity_type_check', sql`${table.entityType} IN ('project', 'snippet')`)
}))

// ====================================================
// Relations
// ====================================================

export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  snippets: many(snippets)
}))

export const projectsRelations = relations(projects, ({ many, one }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.userId]
  }),
  tagAssignments: many(tagAssignments)
}))

export const snippetsRelations = relations(snippets, ({ many, one }) => ({
  user: one(users, {
    fields: [snippets.userId],
    references: [users.userId]
  }),
  tagAssignments: many(tagAssignments)
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  tagAssignments: many(tagAssignments)
}))

export const tagAssignmentsRelations = relations(tagAssignments, ({ one }) => ({
  tag: one(tags, {
    fields: [tagAssignments.tagId],
    references: [tags.tagId]
  })
  // Note: The polymorphic relationship to projects/snippets would require
  // application-level handling since Drizzle doesn't directly support polymorphic relations
}))

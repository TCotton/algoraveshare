// ====================================================
// Algorave Share - Database Types
// Generated from: sql/001_init_schema_with_software_snippets.sql
// ====================================================

// ====================================================
// Enums
// ====================================================

export type AudioFileType = "wav" | "mp3" | "flac" | "aac" | "ogg"

export type SoftwareType = "strudel" | "tidalcycles"

export type EntityType = "project" | "snippet"

// ====================================================
// Users Table
// ====================================================

export interface User {
  userId: string // UUID
  name: string // CITEXT (1-200 chars)
  email: string // CITEXT
  passwordHash: string
  location: string | null // max 200 chars
  createdAt: Date // TIMESTAMPTZ
  portfolioUrl: string | null // URL
  youtubeUrl: string | null // URL
  mastodonUrl: string | null // URL
  blueskyUrl: string | null // URL
  linkedinUrl: string | null // URL
}

export interface UserInsert {
  userId?: string
  name: string
  email: string
  passwordHash: string
  location?: string | null
  createdAt?: Date
  portfolioUrl?: string | null
  youtubeUrl?: string | null
  mastodonUrl?: string | null
  blueskyUrl?: string | null
  linkedinUrl?: string | null
}

export interface UserUpdate {
  userId?: string
  name?: string
  email?: string
  passwordHash?: string
  location?: string | null
  createdAt?: Date
  portfolioUrl?: string | null
  youtubeUrl?: string | null
  mastodonUrl?: string | null
  blueskyUrl?: string | null
  linkedinUrl?: string | null
}

// ====================================================
// Projects Table
// ====================================================

export interface Project {
  projectId: string // UUID
  projectName: string // 1-200 chars
  userId: string // UUID (FK to users)
  codeStart: string | null
  codeEnd: string | null
  codeFull: string | null
  description: string
  audioFilePath: string | null
  audioFileType: AudioFileType | null
  youtubeUrlId: string | null
  softwareType: SoftwareType
  createdAt: Date // TIMESTAMPTZ
}

export interface ProjectInsert {
  projectId?: string
  projectName: string
  userId: string
  codeStart?: string | null
  codeEnd?: string | null
  codeFull?: string | null
  description: string
  audioFilePath?: string | null
  audioFileType?: AudioFileType | null
  youtubeUrlId?: string | null
  softwareType: SoftwareType
  createdAt?: Date
}

export interface ProjectUpdate {
  projectId?: string
  projectName?: string
  userId?: string
  codeStart?: string | null
  codeEnd?: string | null
  codeFull?: string | null
  description?: string
  audioFilePath?: string | null
  audioFileType?: AudioFileType | null
  youtubeUrlId?: string | null
  softwareType?: SoftwareType
  createdAt?: Date
}

// ====================================================
// Snippets Table
// ====================================================

export interface Snippet {
  snippetId: string // UUID
  userId: string // UUID (FK to users)
  codeSample: string // max 400 chars
  description: string
  audioFilePath: string | null
  audioFileType: AudioFileType | null
  softwareType: SoftwareType
  createdAt: Date // TIMESTAMPTZ
}

export interface SnippetInsert {
  snippetId?: string
  userId: string
  codeSample: string
  description: string
  audioFilePath?: string | null
  audioFileType?: AudioFileType | null
  softwareType: SoftwareType
  createdAt?: Date
}

export interface SnippetUpdate {
  snippetId?: string
  userId?: string
  codeSample?: string
  description?: string
  audioFilePath?: string | null
  audioFileType?: AudioFileType | null
  softwareType?: SoftwareType
  createdAt?: Date
}

// ====================================================
// Tags Table
// ====================================================

export interface Tag {
  tagId: number // SERIAL
  name: string // 1-50 chars
}

export interface TagInsert {
  tagId?: number
  name: string
}

export interface TagUpdate {
  tagId?: number
  name?: string
}

// ====================================================
// Tag Assignments Table (Polymorphic)
// ====================================================

export interface TagAssignment {
  tagId: number // FK to tags
  entityType: EntityType
  entityId: string // UUID (FK to projects or snippets)
  createdAt: Date // TIMESTAMPTZ
}

export interface TagAssignmentInsert {
  tagId: number
  entityType: EntityType
  entityId: string
  createdAt?: Date
}

export interface TagAssignmentUpdate {
  tagId?: number
  entityType?: EntityType
  entityId?: string
  createdAt?: Date
}

// ====================================================
// Related Types with Joins
// ====================================================

export interface ProjectWithUser extends Project {
  user: User
}

export interface ProjectWithTags extends Project {
  tags: Array<Tag>
}

export interface ProjectWithUserAndTags extends Project {
  user: User
  tags: Array<Tag>
}

export interface SnippetWithUser extends Snippet {
  user: User
}

export interface SnippetWithTags extends Snippet {
  tags: Array<Tag>
}

export interface SnippetWithUserAndTags extends Snippet {
  user: User
  tags: Array<Tag>
}

export interface UserWithProjects extends User {
  projects: Array<Project>
}

export interface UserWithSnippets extends User {
  snippets: Array<Snippet>
}

export interface UserWithAll extends User {
  projects: Array<Project>
  snippets: Array<Snippet>
}

// ====================================================
// Helper Types
// ====================================================

export type Tables = {
  users: User
  projects: Project
  snippets: Snippet
  tags: Tag
  tagAssignments: TagAssignment
}

export type TableInserts = {
  users: UserInsert
  projects: ProjectInsert
  snippets: SnippetInsert
  tags: TagInsert
  tagAssignments: TagAssignmentInsert
}

export type TableUpdates = {
  users: UserUpdate
  projects: ProjectUpdate
  snippets: SnippetUpdate
  tags: TagUpdate
  tagAssignments: TagAssignmentUpdate
}

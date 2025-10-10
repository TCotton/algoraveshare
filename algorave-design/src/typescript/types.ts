// Types generated from algorave-design/sql/001_init_schema_with_software_snippets.sql

export type UUID = string;
export type Timestamp = string;

export interface User {
  user_id: UUID;
  name: string;
  email: string;
  password_hash: string;
  location?: string | null;
  created_at: Timestamp;
  portfolio?: string | null;
  youtube_url?: string | null;
  mastodon_url?: string | null;
  bluesky_url?: string | null;
  linkedin_url?: string | null;
}

export type SoftwareType = 'strudel' | 'tidalcycles';
export type AudioFileType = 'wav' | 'mp3' | 'flac' | 'aac' | 'ogg';

export interface Project {
  project_id: UUID;
  project_name: string;
  user_id: UUID;
  code_start?: string | null;
  code_end?: string | null;
  code_full?: string | null;
  description: string;
  audio_file_path?: string | null;
  audio_file_type?: AudioFileType | null;
  youtube_url_id?: string | null;
  software_type: SoftwareType;
  created_at: Timestamp;
}

export interface Snippet {
  snippet_id: UUID;
  user_id: UUID;
  code_sample: string;
  description: string;
  audio_file_path?: string | null;
  audio_file_type?: AudioFileType | null;
  software_type: SoftwareType;
  created_at: Timestamp;
}

export interface Tag {
  tag_id: number;
  name: string;
}

export type EntityType = 'project' | 'snippet';

export interface TagAssignment {
  tag_id: number;
  entity_type: EntityType;
  entity_id: UUID;
  created_at: Timestamp;
}

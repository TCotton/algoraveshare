-- ====================================================
-- Migration 003: Projects Table
-- ====================================================
-- Create the projects table for user projects
-- Includes foreign key reference to users table
-- Has indexes for common queries

CREATE TABLE projects (
                          project_id      UUID PRIMARY KEY     DEFAULT uuidv7(),
                          project_name    TEXT        NOT NULL CHECK (char_length(project_name) BETWEEN 1 AND 200),
                          user_id         UUID        NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
                          code_start      TEXT,
                          code_end        TEXT,
                          code_full       TEXT,
                          description     TEXT        NOT NULL,
                          audio_file_path TEXT,
                          audio_file_type TEXT CHECK (audio_file_type IN ('wav', 'mp3', 'flac', 'aac', 'ogg')),
    -- Stores audio metadata as JSON. Typical structure:
    -- {
    --   "duration": <float, seconds>,
    --   "bitrate": <int, kbps>,
    --   "sample_rate": <int, Hz>,
    --   "channels": <int>,
    --   "format": <string, e.g. "wav" or "mp3">
    -- }
                          audio_data      JSONB,
                          youtube_url_id  TEXT,
                          software_type   TEXT        NOT NULL CHECK (software_type IN ('strudel', 'tidalcycles')),
                          created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX CONCURRENTLY idx_projects_owner_id ON projects (owner_id);
CREATE INDEX CONCURRENTLY idx_projects_created_at ON projects (created_at DESC);

-- ====================================================
-- Migration 004: Snippets Table
-- ====================================================
-- Create the snippets table for code snippets
-- Includes foreign key reference to users table
-- Has indexes for performance

CREATE TABLE snippets (
                          snippet_id      UUID PRIMARY KEY     DEFAULT uuidv7(),
                          snippet_name    TEXT        NOT NULL CHECK (char_length(snippet_name) BETWEEN 1 AND 200),
                          user_id         UUID        NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
                          code_sample     TEXT        NOT NULL CHECK (char_length(code_sample) <= 400),
                          description     TEXT        NOT NULL,
                          audio_file_path TEXT,
                          audio_file_type TEXT CHECK (audio_file_type IN ('wav', 'mp3', 'flac', 'aac', 'ogg')),
                          audio_data      JSONB,
                          software_type   TEXT        NOT NULL CHECK (software_type IN ('strudel', 'tidalcycles')),
                          created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX CONCURRENTLY idx_snippets_user_id ON snippets (user_id);
CREATE INDEX CONCURRENTLY idx_snippets_language ON snippets (language);
CREATE INDEX CONCURRENTLY idx_snippets_created_at ON snippets (created_at DESC);

-- ====================================================
-- Migration 004: Snippets Table
-- ====================================================
-- Create the snippets table for code snippets
-- Includes foreign key reference to users table
-- Has indexes for performance

CREATE TABLE snippets (
    snippet_id  UUID        PRIMARY KEY DEFAULT uuid_generate_v7(),
    author_id   UUID        NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title       TEXT        NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
    description TEXT        NULL,
    code        TEXT        NOT NULL,
    language    TEXT        NOT NULL CHECK (char_length(language) BETWEEN 1 AND 50),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_snippets_author_id ON snippets (author_id);
CREATE INDEX idx_snippets_language ON snippets (language);
CREATE INDEX idx_snippets_created_at ON snippets (created_at DESC);

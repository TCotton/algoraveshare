-- ====================================================
-- Algorave Share - Initial Database Schema (with software_type in projects & snippets)
-- ====================================================

-- Security setup (for provisioning, not migrations)
-- CREATE ROLE algorave_app LOGIN PASSWORD 'secure_password' NOSUPERUSER NOCREATEDB NOCREATEROLE;
-- GRANT CONNECT ON DATABASE algorave_share TO algorave_app;

-- Extensions```````
CREATE
EXTENSION IF NOT EXISTS citext;
CREATE
EXTENSION IF NOT EXISTS pgcrypto;

-- ====================================================
-- Users
-- ====================================================
CREATE TABLE users
(
    user_id       UUID PRIMARY KEY     DEFAULT gen_random_uuid(),
    name          CITEXT      NOT NULL UNIQUE CHECK (char_length(name) BETWEEN 1 AND 200),
    email         CITEXT      NOT NULL UNIQUE,
    password_hash TEXT        NOT NULL,
    location      TEXT CHECK (char_length(location) <= 200) NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    portfolio_url TEXT CHECK (portfolio_url ~ '^https?://'
) NULL,
    youtube_url      TEXT CHECK (youtube_url ~ '^https?://') NULL,
    mastodon_url     TEXT CHECK (mastodon_url ~ '^https?://') NULL,
    bluesky_url      TEXT CHECK (bluesky_url ~ '^https?://') NULL,
    linkedin_url     TEXT CHECK (linkedin_url ~ '^https?://') NULL
);

-- ====================================================
-- Projects
-- ====================================================
CREATE TABLE projects
(
    project_id      UUID PRIMARY KEY     DEFAULT gen_random_uuid(),
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
    -- }    audio_data      JSONB,
    youtube_url_id  TEXT,
    software_type   TEXT        NOT NULL CHECK (software_type IN ('strudel', 'tidalcycles')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_projects_user_id ON projects (user_id);

-- ====================================================
-- Snippets
-- ====================================================
CREATE TABLE snippets
(
    snippet_id      UUID PRIMARY KEY     DEFAULT gen_random_uuid(),
    snippet_name    TEXT        NOT NULL CHECK (char_length(snippet_name) BETWEEN 1 AND 200),
    user_id         UUID        NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    code_sample     TEXT        NOT NULL CHECK (char_length(code_sample) <= 400),
    description     TEXT        NOT NULL,
    audio_file_path TEXT,
    audio_file_type TEXT CHECK (audio_file_type IN ('wav', 'mp3', 'flac', 'aac', 'ogg')),
    software_type   TEXT        NOT NULL CHECK (software_type IN ('strudel', 'tidalcycles')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_snippets_user_id ON snippets (user_id);

-- ====================================================
-- Tags
-- ====================================================
CREATE TABLE tags
(
    tag_id SERIAL PRIMARY KEY,
    name   TEXT NOT NULL UNIQUE CHECK (char_length(name) BETWEEN 1 AND 50)
);

-- ====================================================
-- Tag Assignments (Polymorphic relationship)
-- ====================================================
CREATE TABLE tag_assignments
(
    tag_id      INT         NOT NULL REFERENCES tags (tag_id) ON DELETE CASCADE,
    entity_type TEXT        NOT NULL CHECK (entity_type IN ('project', 'snippet')),
    entity_id   UUID        NOT NULL,
    PRIMARY KEY (tag_id, entity_type, entity_id),
    -- Optional: use a CHECK constraint to ensure entity_id exists in the right table
    -- This can't be enforced directly with FK constraints, but can be done via triggers if needed
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tag_assignments_entity_id ON tag_assignments (entity_id);
CREATE INDEX idx_tag_assignments_entity_type ON tag_assignments (entity_type);


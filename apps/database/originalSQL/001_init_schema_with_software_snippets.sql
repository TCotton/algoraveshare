-- ====================================================
-- Algorave Share - Initial Database Schema (with software_type in projects & snippets)
-- ====================================================

-- Security setup (for provisioning, not migrations)
-- CREATE ROLE algorave_app LOGIN PASSWORD 'secure_password' NOSUPERUSER NOCREATEDB NOCREATEROLE;
-- GRANT CONNECT ON DATABASE algorave_share TO algorave_app;

-- Extensions
CREATE
EXTENSION IF NOT EXISTS citext;
CREATE
EXTENSION IF NOT EXISTS pgcrypto;
CREATE
EXTENSION IF NOT EXISTS pg_uuidv7;
-- ====================================================
-- Users
-- ====================================================
CREATE TABLE users
(
    user_id       UUID PRIMARY KEY     DEFAULT uuid_generate_v7(),
    name          CITEXT      NOT NULL UNIQUE CHECK (char_length(name) BETWEEN 1 AND 200),
    email         CITEXT      NOT NULL UNIQUE,
    password_hash TEXT        NOT NULL,
    location      TEXT CHECK (char_length(location) <= 200) NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    portfolio_url TEXT CHECK (portfolio_url ~ '^https://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}.*$'
) NULL,
    youtube_url      TEXT CHECK (youtube_url ~ '^https://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}.*$') NULL,
    mastodon_url     TEXT CHECK (mastodon_url ~ '^https://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}.*$') NULL,
    bluesky_url      TEXT CHECK (bluesky_url ~ '^https://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}.*$') NULL,
    linkedin_url     TEXT CHECK (linkedin_url ~ '^https://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}.*$') NULL
);

-- ====================================================
-- Projects
-- ====================================================
CREATE TABLE projects
(
    project_id      UUID PRIMARY KEY     DEFAULT uuid_generate_v7(),
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

CREATE INDEX idx_projects_user_id ON projects (user_id);

-- ====================================================
-- Snippets
-- ====================================================
CREATE TABLE snippets
(
    snippet_id      UUID PRIMARY KEY     DEFAULT uuid_generate_v7(),
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

-- ====================================================
-- Audit Log
-- ====================================================
CREATE TABLE audit_log
(
    audit_id    UUID PRIMARY KEY     DEFAULT uuid_generate_v7(),
    user_id     UUID REFERENCES users (user_id) ON DELETE SET NULL,
    action      TEXT        NOT NULL CHECK (action IN ('user_created', 'user_updated', 'user_deleted', 'project_created', 'project_updated', 'project_deleted', 'snippet_created', 'snippet_updated', 'snippet_deleted')),
    details     JSONB       NOT NULL,
    entity_type TEXT        NOT NULL CHECK (entity_type IN ('project', 'snippet', 'user')),
    entity_id   UUID        NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_log_created_at ON audit_log (created_at);
CREATE INDEX idx_audit_log_action ON audit_log (action);
CREATE INDEX idx_audit_log_entity ON audit_log (entity_type, entity_id);
CREATE INDEX idx_audit_log_user_id ON audit_log (user_id);

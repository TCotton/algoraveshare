-- ====================================================
-- Migration 003: Projects Table
-- ====================================================
-- Create the projects table for user projects
-- Includes foreign key reference to users table
-- Has indexes for common queries

CREATE TABLE projects (
    project_id  UUID        PRIMARY KEY DEFAULT uuid_generate_v7(),
    owner_id    UUID        NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    name        TEXT        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 200),
    description TEXT        NULL,
    repository  TEXT        NULL CHECK (repository ~ '^https?://'),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_projects_owner_id ON projects (owner_id);
CREATE INDEX idx_projects_created_at ON projects (created_at DESC);

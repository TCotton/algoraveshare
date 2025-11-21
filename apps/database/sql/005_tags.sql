-- ====================================================
-- Migration 005: Tags and Tag Assignments
-- ====================================================
-- Create tags table and polymorphic tag_assignments table
-- Tags can be assigned to both projects and snippets

CREATE TABLE tags (
    tag_id     UUID  PRIMARY KEY DEFAULT uuidv7(),
    name       CITEXT NOT NULL UNIQUE CHECK (char_length(name) BETWEEN 1 AND 50)
);

CREATE TABLE tag_assignments (
    assignment_id    UUID PRIMARY KEY DEFAULT uuidv7(),
    tag_id           UUID NOT NULL REFERENCES tags(tag_id) ON DELETE CASCADE,
    tagged_entity_id UUID NOT NULL,
    entity_type      TEXT NOT NULL CHECK (entity_type IN ('project', 'snippet')),
    UNIQUE (tag_id, tagged_entity_id, entity_type)
    entity_id   UUID        NOT NULL,
    PRIMARY KEY (tag_id, entity_type, entity_id),
    -- Optional: use a CHECK constraint to ensure entity_id exists in the right table
    -- This can't be enforced directly with FK constraints, but can be done via triggers if needed
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX CONCURRENTLY idx_tag_assignments_tagged_entity ON tag_assignments (tagged_entity_id, entity_type);
CREATE INDEX CONCURRENTLY idx_tag_assignments_tag_id ON tag_assignments (tag_id);

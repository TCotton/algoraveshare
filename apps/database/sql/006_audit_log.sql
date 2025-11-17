-- ====================================================
-- Migration 006: Audit Log Table
-- ====================================================
-- Create audit_log table for tracking system events
-- Stores user actions with metadata and timestamps

CREATE TABLE audit_log (
    log_id       UUID        PRIMARY KEY DEFAULT uuid_generate_v7(),
    user_id      UUID        NULL REFERENCES users(user_id) ON DELETE SET NULL,
    action       TEXT        NOT NULL CHECK (char_length(action) BETWEEN 1 AND 100),
    entity_type  TEXT        NULL CHECK (char_length(entity_type) <= 50),
    entity_id    UUID        NULL,
    metadata     JSONB       NULL,
    ip_address   INET        NULL,
    user_agent   TEXT        NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_log_user_id ON audit_log (user_id);
CREATE INDEX idx_audit_log_action ON audit_log (action);
CREATE INDEX idx_audit_log_entity ON audit_log (entity_type, entity_id);
CREATE INDEX idx_audit_log_created_at ON audit_log (created_at DESC);

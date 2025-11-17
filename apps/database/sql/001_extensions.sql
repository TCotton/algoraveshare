-- ====================================================
-- Migration 001: PostgreSQL Extensions
-- ====================================================
-- Install required PostgreSQL extensions for the application
-- - citext: Case-insensitive text for emails and usernames
-- - pgcrypto: Cryptographic functions
-- - pg_uuidv7: UUID version 7 support (time-ordered UUIDs)

CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_uuidv7;

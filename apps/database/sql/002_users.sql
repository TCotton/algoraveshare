-- ====================================================
-- Migration 002: Users Table
-- ====================================================
-- Create the users table for storing user accounts
-- Uses CITEXT for case-insensitive email and username matching
-- Includes social media profile URLs with validation

CREATE TABLE users (
    user_id       UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    name          CITEXT      NOT NULL UNIQUE CHECK (char_length(name) BETWEEN 1 AND 200),
    email         CITEXT      NOT NULL UNIQUE,
    password_hash TEXT        NOT NULL,
    location      TEXT        NULL CHECK (char_length(location) <= 200),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    portfolio_url TEXT        NULL CHECK (portfolio_url ~ '^https://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}.*$'),
    youtube_url   TEXT        NULL CHECK (youtube_url ~ '^https://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}.*$'),
    mastodon_url  TEXT        NULL CHECK (mastodon_url ~ '^https://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}.*$'),
    bluesky_url   TEXT        NULL CHECK (bluesky_url ~ '^https://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}.*$'),
    linkedin_url  TEXT        NULL CHECK (linkedin_url ~ '^https://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}.*$')
);

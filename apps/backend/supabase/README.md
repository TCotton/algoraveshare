# Supabase integration — AlgoraveShare

This document explains how to provision a Supabase project for AlgoraveShare,
map and run database migrations with Drizzle (or Knex), and set up Row Level
Security (RLS) policies for authentication and authorization. It also
includes CI and local-dev guidance for handling Supabase secrets.

## 1) Provision a Supabase project

1. Create a Supabase project
   - Sign in to https://app.supabase.com and create a new project.
   - Choose a project name and region.
   - Note the Postgres DB password you set during provisioning.

2. Get the keys and connection info
   - From the project Dashboard → Settings → API:
     - `SUPABASE_URL` (the project's REST/JS URL)
     - `SUPABASE_ANON_KEY` (public anon key for client uses)
     - `SUPABASE_SERVICE_ROLE_KEY` (server-side privileged key)
   - From Settings → Database → Connection string, copy the Postgres
     connection string if needed for migration tooling.

3. Local development options
   - Use the Supabase CLI for local development (replay DB, start edge functions):
     - Install: `npm i -g supabase` or use the official Docker images.
     - Authenticate: `supabase login` and `supabase link --project-ref <ref>`.
   - Or create a lightweight Docker Compose Postgres instance and point
     your migration tooling at it for fast iteration (less fidelity but faster).

## 2) Environment variables (recommended)

Add these to your CI secrets and local `.env` (local `.env` must NOT be
committed):

- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- DATABASE_URL (optional — the Postgres connection string for migration tools)

CI note: Only the service-role key should be used for running migrations in CI.
The service role key is privileged — treat it like a secret and store it in
GitHub Actions Secrets or Docker secrets.

## 3) Mapping migrations: Drizzle (recommended) and Knex

General guidance:
 - Keep migrations in `backend/db/migrations` or `backend/migrations`.
 - Commit SQL or migration files to the repo so they are reproducible.

Drizzle (drizzle-kit)
---------------------

1. Install and configure (example):

```js
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './backend/db/schema.ts',
  out: './backend/db/migrations',
  driver: 'pg',
  connectionString: process.env.DATABASE_URL || process.env.SUPABASE_DB_URL,
})
```

2. Environment: set `DATABASE_URL` in local `.env` or CI to the Supabase
   Postgres connection string (or use `SUPABASE_DB_URL` if you prefer naming).

3. Create a migration (example using SQL file):
   - `npx drizzle-kit generate` (if using schema-based generation), or
   - Add SQL file to `backend/db/migrations/0001_init.sql` and commit.

4. Apply migrations in CI or locally (example):
   - `npx drizzle-kit push` (runs migrations against `connectionString`)

Knex (alternative)
-------------------

1. Install and configure `knex` and `pg`.

2. Example `knexfile.js`:

```js
module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || process.env.SUPABASE_DB_URL,
    migrations: { directory: './backend/db/migrations' },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: { directory: './backend/db/migrations' },
  },
}
```

3. Create and run migrations:
   - `npx knex migrate:make init_users` → creates a migration file
   - `npx knex migrate:latest --env production` to run in CI (use `DATABASE_URL`)

Notes on migration strategy
 - Prefer SQL-first migrations (raw `.sql`) for transparency with Supabase.
 - Keep destructive changes behind feature flags and plan rollouts.
 - Use the Supabase SQL editor only for exploration; keep canonical migrations
   in the repo so CI can apply them.

## 4) Row Level Security (RLS) and policies

Supabase ships with JWT-based auth. When RLS is enabled, policies control who
can select/insert/update/delete rows.

Example: a `profiles` table where each row belongs to a user (id = auth uid)

1. Enable RLS on the table:

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

2. Create a policy allowing the owner to select/insert/update their row:

```sql
-- Allow SELECT only for owner
CREATE POLICY "Profiles: owner can select" ON profiles
  FOR SELECT USING (auth.uid() = user_id::text);

-- Allow INSERT: allow creation when the jwt subject matches
CREATE POLICY "Profiles: owner can insert" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id::text);

-- Allow UPDATE: only when owner
CREATE POLICY "Profiles: owner can update" ON profiles
  FOR UPDATE USING (auth.uid() = user_id::text) WITH CHECK (auth.uid() = user_id::text);
```

Notes:
 - `auth.uid()` returns the `sub` claim from the JWT issued by Supabase.
 - If your user id is stored as UUID, cast appropriately (e.g., `auth.uid()::uuid`).
 - Test policies using `jwt` headers in the Supabase SQL editor or via curl.

Policy for public read, authenticated write (example for `posts`):

```sql
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Posts: public read" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Posts: authenticated write" ON posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

Admin-only operations
---------------------

Use the `service_role` key only in trusted server contexts. To allow a
maintenance job or admin role to bypass RLS, use the service role key or a
policy that checks a claim included in JWTs you mint for admins.

Example: temporary migration run in CI uses `SUPABASE_SERVICE_ROLE_KEY` which
is allowed to bypass RLS for migrations and schema changes.

## 5) CI integration (migrations & secrets)

Suggested GitHub Actions steps (conceptual):

1. Add the following secrets in the repository settings:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL` (optional, if you prefer pointing directly to Postgres)

2. CI job to run migrations (example steps):

```yaml
- name: Apply DB migrations
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL || format('postgresql://postgres:%s@%s:5432/postgres', secrets.SUPABASE_PG_PASSWORD, secrets.SUPABASE_PG_HOST) }}
    SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
  run: |
    npm ci --prefix backend
    npx drizzle-kit push --config backend/drizzle.config.ts
```

Notes:
 - Only the migration job needs the `SUPABASE_SERVICE_ROLE_KEY`. Do not expose it
   to client-side builds.
 - For safety, run migrations behind a protected branch or after approvals.

## 6) Local dev and testing

- Use a dedicated Supabase project for development and a separate one for
  staging/CI. Avoid running tests against production.
- Use the Supabase CLI `supabase start` to run a local Postgres + Realtime
  stack for development (store local project ref separately).
- For unit tests, mock Supabase client calls or use a test database with
  a separate service-role key restricted to CI.

## 7) Helpful snippets & troubleshooting

- Confirm current policies:

```sql
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

- Temporarily simulate a user in Supabase SQL editor by setting `jwt` header
  when running queries.

## 8) Security reminders

- Never commit `SUPABASE_SERVICE_ROLE_KEY` or any secret into the repo.
- Rotate service keys if they are exposed or when personnel change.
- Limit use of service-role key to trusted CI jobs and server-side code.

---

If you'd like, I can also:
- Add a `backend/supabase/example.env` (gitignored) showing required env vars.
- Add a `backend/supabase/drizzle.config.ts` or `knexfile.js` example wired to
  the repository layout and show a one-click GitHub Actions job to run migrations.

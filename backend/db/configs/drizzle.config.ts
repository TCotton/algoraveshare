import { defineConfig } from "drizzle-kit";
import path from 'path';

export default defineConfig({
    dialect: "postgresql",
    dbCredentials: {
        url: "postgresql://user:postgres@host:5432/testDB",
    },
    // schema path is relative to this config file. schema.ts is one level up.
    schema: path.resolve(__dirname, 'schema.ts'),
    out: "./migrations",
    schemaFilter: "public",
    verbose: true,
    strict: true,
});
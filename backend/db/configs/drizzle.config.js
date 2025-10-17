import { defineConfig } from "drizzle-kit"
import path from "path"
import "dotenv/config"

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_URL
  },
  schema: path.resolve(__dirname, "schema.ts"),
  out: "./migrations",
  schemaFilter: "public",
  verbose: true,
  strict: true
})
// # sourceMappingURL=drizzle.config.js.map

/* eslint-env node */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const configPath = path.resolve(__dirname, "../db/configs/drizzle.config.ts")
console.log("Reading config file", configPath)
try {
  // Use dynamic import via ts-node/register is not available here; we attempt to parse as text
  const text = fs.readFileSync(configPath, "utf8")
  // simple regex to extract schema path - not robust but helpful for local checks
  const m = text.match(/schema:\s*"([^"]+)"/)
  if (!m) {
    console.error("Could not find schema entry in config")
    process.exit(2)
  }
  const schemaRel = m[1]
  const schemaPath = path.resolve(path.dirname(configPath), schemaRel)
  console.log("Resolved schema path:", schemaPath)
  if (!fs.existsSync(schemaPath)) {
    console.error("Schema file NOT found at", schemaPath)
    process.exit(3)
  }
  console.log("Schema file exists. Good.")
  process.exit(0)
} catch (err) {
  console.error("Error reading config or schema:", err)
  process.exit(1)
}

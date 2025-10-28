// Script: Convert OpenAPI YAML to TypeScript types
// Usage: npx ts-node backend/scripts/openapi-to-types.ts backend/openapi/openapi.yaml backend/openapi/types.ts
import { execSync } from 'child_process'

const [, , inputFile, outputFile] = process.argv
if (!inputFile || !outputFile) {
  console.error('Usage: ts-node openapi-to-types.ts <input.yaml> <output.ts>')
  process.exit(1)
}
// Ensure openapi-typescript is installed
try {
  execSync('npx openapi-typescript --version', { stdio: 'ignore' })
} catch {
  console.error('Missing dependency: openapi-typescript. Install with: npm install --save-dev openapi-typescript')
  process.exit(1)
}
// Run openapi-typescript CLI
try {
  execSync(`npx openapi-typescript ${inputFile} -o ${outputFile}`, { stdio: 'inherit' })
  console.log(`TypeScript types generated at ${outputFile}`)
} catch (err) {
  console.error('Failed to generate types:', err)
  process.exit(1)
}
// # sourceMappingURL=openapi-to-types.js.map

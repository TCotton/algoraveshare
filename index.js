// Minimal ESM entrypoint for algoraveshare

export function hello() {
  return 'Hello from AlgoraveShare (ESM)';
}

if (import.meta.url === process.argv[1] || import.meta.url === `file://${process.cwd()}/index.js`) {
  // If executed directly with `node index.js`, print a message
  console.log(hello());
}

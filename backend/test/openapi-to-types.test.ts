import { execSync } from 'child_process';
import path from 'path';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const scriptPath = path.resolve(__dirname, '../scripts/openapi-to-types.ts');

// Helper to run the script with args
function runScript(args: string[] = []) {
  return execSync(`ts-node ${scriptPath} ${args.join(' ')}`, { encoding: 'utf-8' });
}

describe('openapi-to-types script', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it.skip('should exit with usage if no args', () => {
    vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    expect(() => runScript([])).toThrow(/Usage: node openapi-to-types.ts/);
  });

  it.skip('should exit if openapi-typescript is missing', () => {
    vi.spyOn(require('child_process'), 'execSync').mockImplementation(() => { throw new Error('not found'); });
    expect(() => runScript(['input.yaml', 'output.ts'])).toThrow(/Missing dependency: openapi-typescript/);
  });

  it.skip('should call openapi-typescript CLI with correct args', () => {
    const calls: string[] = [];
    vi.spyOn(require('child_process'), 'execSync').mockImplementation((cmd: string) => {
      calls.push(cmd);
      // Simulate success for both dependency check and CLI run
      if (cmd.includes('openapi-typescript --version')) return '';
      if (cmd.includes('openapi-typescript input.yaml -o output.ts')) return '';
      return '';
    });
    expect(() => runScript(['input.yaml', 'output.ts'])).not.toThrow();
    // Assert the CLI was called with the correct command
    expect(calls.some(cmd => cmd.includes('openapi-typescript input.yaml -o output.ts'))).toBe(true);
  });
});

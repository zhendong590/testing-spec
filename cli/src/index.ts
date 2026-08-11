import { Command } from 'commander';
import { readFileSync, realpathSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { validateCommand } from './commands/validate.js';
import { runCommand } from './commands/run.js';
import { parseCommand } from './commands/parse.js';
import { listCommand } from './commands/list.js';
import { mcpCommand } from './commands/mcp.js';
import { pluginListCommand } from './commands/plugin-list.js';
import { pluginInstallCommand } from './commands/plugin-install.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));

const program = new Command();

program
  .name('tspec')
  .description('CLI for @boolesai/tspec testing framework')
  .version(packageJson.version);

program.addCommand(validateCommand);
program.addCommand(runCommand);
program.addCommand(parseCommand);
program.addCommand(listCommand);
program.addCommand(mcpCommand);
program.addCommand(pluginListCommand);
program.addCommand(pluginInstallCommand);

export { parseKeyValue } from './commands/run.js';

// Only run the CLI when executed as the program entry (import.meta.url match)
// or via the bin wrapper (bin/tspec.js re-exports this module). Library imports
// (e.g. tests) skip parsing so the caller's argv is left untouched.
const __isEntry = (() => {
  if (!process.argv[1]) return false;
  // realpath both sides: npm global install exposes bin/tspec.js via a symlink
  // (e.g. /usr/local/bin/tspec) while import.meta.url resolves to the real path.
  const entry = realpathSync(resolve(process.argv[1]));
  return entry === __filename || entry === realpathSync(resolve(__dirname, '../bin/tspec.js'));
})();
if (__isEntry) {
  await program.parseAsync();
}

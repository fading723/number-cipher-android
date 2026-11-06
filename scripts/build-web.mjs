import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
await build({
  entryPoints: [path.join(root, 'app/src/main/assets/www/app.js')],
  outfile: path.join(root, 'app/src/main/assets/www/game.bundle.js'),
  bundle: true,
  format: 'iife',
  target: ['chrome61'],
  charset: 'utf8',
  minify: true,
  legalComments: 'none',
  logLevel: 'info',
});

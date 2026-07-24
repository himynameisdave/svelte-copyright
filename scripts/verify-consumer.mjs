/**
 * Builds a throwaway Svelte app that installs the packed tarball with a given
 * package manager, then bundles it. Proves the published artifact is consumable
 * by people who aren't using Bun.
 *
 * Usage: node ./scripts/verify-consumer.mjs [npm|yarn|pnpm|bun]
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageManager = process.argv[2] ?? 'npm';
const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

//  Pack with npm rather than bun, since npm is what actually publishes to the registry.
function packTarball(destination) {
  execFileSync('npm', ['pack', '--pack-destination', destination], {
    cwd: rootDirectory,
    stdio: 'inherit',
  });

  const tarball = fs.readdirSync(destination)
    .find((file) => file.startsWith('svelte-copyright-') && file.endsWith('.tgz'));

  if (!tarball) {
    throw new Error('`npm pack` did not produce a tarball.');
  }

  return path.join(destination, tarball);
}

const addCommand = {
  npm: (tarball) => ['npm', ['install', '--no-audit', '--no-fund', tarball, 'svelte', 'vite', '@sveltejs/vite-plugin-svelte']],
  yarn: (tarball) => ['yarn', ['add', tarball, 'svelte', 'vite', '@sveltejs/vite-plugin-svelte']],
  pnpm: (tarball) => ['pnpm', ['add', tarball, 'svelte', 'vite', '@sveltejs/vite-plugin-svelte']],
  bun: (tarball) => ['bun', ['add', tarball, 'svelte', 'vite', '@sveltejs/vite-plugin-svelte']],
}[packageManager];

if (!addCommand) {
  throw new Error(`Unsupported package manager: ${packageManager}`);
}

const workDirectory = fs.mkdtempSync(path.join(os.tmpdir(), `svelte-copyright-${packageManager}-`));
const tarball = packTarball(workDirectory);

const files = {
  'package.json': JSON.stringify({
    name: 'consumer-check',
    private: true,
    type: 'module',
  }, undefined, 2),
  'vite.config.js': [
    "import { svelte } from '@sveltejs/vite-plugin-svelte';",
    '',
    'export default {',
    '  plugins: [svelte()],',
    "  build: { lib: { entry: 'src/main.js', formats: ['es'], fileName: 'out' } },",
    '};',
    '',
  ].join('\n'),
  'svelte.config.js': 'export default {};\n',
  'src/App.svelte': [
    '<script>',
    "  import Copyright, { FORMAT } from 'svelte-copyright';",
    '</script>',
    '',
    '<Copyright format={FORMAT.TWO_DIGIT} showRange date={new Date(1991, 0, 1)}>',
    '  Mindless Corp.',
    '</Copyright>',
    '',
  ].join('\n'),
  'src/main.js': "export { default } from './App.svelte';\n",
};

for (const [filePath, contents] of Object.entries(files)) {
  const destination = path.join(workDirectory, filePath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, contents);
}

const run = (command, arguments_) => execFileSync(command, arguments_, {
  cwd: workDirectory,
  stdio: 'inherit',
});

console.log(`\n→ ${packageManager}: installing ${path.basename(tarball)} in ${workDirectory}`);
const [command, arguments_] = addCommand(tarball);
run(command, arguments_);

console.log(`\n→ ${packageManager}: bundling a consumer app`);
run('npx', ['vite', 'build']);

const bundle = fs.readFileSync(path.join(workDirectory, 'dist/out.js'), 'utf8');
if (!bundle.includes('Copyright')) {
  throw new Error('Bundled output does not contain the copyright notice.');
}

console.log(`\n✓ ${packageManager}: resolved, bundled, and rendered the component\n`);
fs.rmSync(workDirectory, { recursive: true, force: true });

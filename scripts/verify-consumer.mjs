/**
 * Guards against publishing something only Bun users can install.
 *
 * This repo develops with Bun, but the package is published to NPM and has to
 * work for everyone. This script packs the tarball with `npm pack`, installs it
 * into a throwaway Svelte app using the requested package manager, and bundles
 * that app, so a broken `exports` map, a missing file in `files`, or a bad
 * `svelte` condition fails loudly instead of reaching the registry.
 *
 * Run by the `consumers` job in .github/workflows/test.yml, once per package
 * manager, on every push.
 *
 * Locally:
 *   bun run verify:consumer          # defaults to npm
 *   bun run verify:consumer pnpm
 *
 * Usage: node ./scripts/verify-consumer.mjs [npm|yarn|pnpm|bun]
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageManager = process.argv[2] ?? 'npm';
const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

//  Promise wrapper around `spawn` rather than `promisify(execFile)`, since execFile
//  buffers the output instead of streaming it, and installs can blow past maxBuffer.
//  Rejects on a non-zero exit so failures still surface as a thrown error in CI.
const execFileAsync = (command, arguments_, options) => new Promise((resolve, reject) => {
  const child = spawn(command, arguments_, { stdio: 'inherit', ...options });

  child.on('error', reject);
  child.on('close', (code) => {
    if (code === 0) {
      resolve();
      return;
    }

    reject(new Error(`\`${command} ${arguments_.join(' ')}\` exited with code ${code}.`));
  });
});

//  Pack with npm rather than bun, since npm is what actually publishes to the registry.
async function packTarball(destination) {
  await execFileAsync('npm', ['pack', '--pack-destination', destination], {
    cwd: rootDirectory,
  });

  const tarball = (await fs.readdir(destination))
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

const workDirectory = await fs.mkdtemp(path.join(os.tmpdir(), `svelte-copyright-${packageManager}-`));
const tarball = await packTarball(workDirectory);

const files = new Map([
  ['package.json', JSON.stringify({
    name: 'consumer-check',
    private: true,
    type: 'module',
  }, undefined, 2)],
  ['vite.config.js', [
    "import { svelte } from '@sveltejs/vite-plugin-svelte';",
    '',
    'export default {',
    '  plugins: [svelte()],',
    "  build: { lib: { entry: 'src/main.js', formats: ['es'], fileName: 'out' } },",
    '};',
    '',
  ].join('\n')],
  ['svelte.config.js', 'export default {};\n'],
  ['src/App.svelte', [
    '<script>',
    "  import Copyright, { FORMAT } from 'svelte-copyright';",
    '</script>',
    '',
    '<Copyright format={FORMAT.TWO_DIGIT} showRange date={new Date(1991, 0, 1)}>',
    '  Mindless Corp.',
    '</Copyright>',
    '',
  ].join('\n')],
  ['src/main.js', "export { default } from './App.svelte';\n"],
]);

//  `Map.forEach` cannot await its callback, so spread and map instead: every write
//  lands on disk before the install below goes looking for the generated package.json.
await Promise.all([...files].map(async ([filePath, contents]) => {
  const destination = path.join(workDirectory, filePath);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, contents);
}));

const run = (command, arguments_) => execFileAsync(command, arguments_, {
  cwd: workDirectory,
});

console.log(`\n→ ${packageManager}: installing ${path.basename(tarball)} in ${workDirectory}`);
const [command, arguments_] = addCommand(tarball);
await run(command, arguments_);

console.log(`\n→ ${packageManager}: bundling a consumer app`);
await run('npx', ['vite', 'build']);

const bundle = await fs.readFile(path.join(workDirectory, 'dist/out.js'), 'utf8');
if (!bundle.includes('Copyright')) {
  throw new Error('Bundled output does not contain the copyright notice.');
}

console.log(`\n✓ ${packageManager}: resolved, bundled, and rendered the component\n`);
await fs.rm(workDirectory, { recursive: true, force: true });

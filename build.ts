import { $ } from 'bun';
import { readFile, rename, rm, writeFile } from 'fs/promises';
import { readdir } from 'fs/promises';
import path from 'path';

await build();
await moveFiles();
await patchImportsPaths();
await eslintFixDist();

async function build() {
  await $`npx tsc --project tsconfig.types.json`;
  await $`rimraf tsconfig.types.tsbuildinfo`;
}

async function moveFiles() {
  const distSrcDir = 'dist/src';
  const files = await readdir(distSrcDir);
  for (const file of files) {
    await rename(path.join(distSrcDir, file), path.join('dist', file));
  }
  await rm(distSrcDir, { recursive: true });
}

async function patchImportsPaths() {
  const dtsPath = 'dist/tests/InMemoryFileHandle.d.ts';
  const dtsContent = await readFile(dtsPath, 'utf8');
  const patched = dtsContent.replace(`from '../src`, `from '..`);
  await writeFile(dtsPath, patched, 'utf8');
}

// Just to have the built files nicely formatted
async function eslintFixDist() {
  try {
    await $`npx eslint dist --fix`.quiet();
  } catch (_error) {
    console.warn(`ESLint errors suppressed`);
  }
}

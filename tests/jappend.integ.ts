import { createId } from '@paralleldrive/cuid2';
import fs from 'fs/promises';
import path from 'path';
import { afterAll, expect, test } from 'vitest';

import { jappend } from '../src/jappend';

afterAll(async () => {
  await removeAllTestJsonFiles();
});

test('appends an entry to a json file', async () => {
  const testJsonFilePath = await createTestJsonFileWithContent([]);

  await jappend(testJsonFilePath, { newKey: 'newValue' });

  await verifyFileContent(testJsonFilePath, [{ newKey: 'newValue' }]);
});

test('appends multiple entries', async () => {
  const testJsonFilePath = await createTestJsonFileWithContent([{ existingKey: 'existingValue' }]);

  await jappend(testJsonFilePath, { newKey1: 'newValue1' });
  await jappend(testJsonFilePath, ['Hello', 'World']);

  await verifyFileContent(testJsonFilePath, [
    { existingKey: 'existingValue' },
    { newKey1: 'newValue1' },
    ['Hello', 'World'],
  ]);
});

test('creates a new file if it does not exist', async () => {
  const testJsonFilePath = createTestJsonFilePath();

  await jappend(testJsonFilePath, { newKey: 'newValue' });

  await verifyFileContent(testJsonFilePath, [{ newKey: 'newValue' }]);
});

test('fails if file does not exist and `initArray` is `false`', async () => {
  const testJsonFilePath = createTestJsonFilePath();

  await expect(jappend(testJsonFilePath, { newKey: 'newValue' }, { initArray: false })).rejects.toThrow(
    expect.objectContaining({ message: expect.stringContaining('no such file or directory') }),
  );
});

function createTestJsonFilePath() {
  return path.join(__dirname, `test-file-${createId()}.json`);
}

async function createTestJsonFileWithContent(content: unknown) {
  const filePath = createTestJsonFilePath();
  await fs.writeFile(filePath, JSON.stringify(content, null, 2));
  return filePath;
}

async function removeAllTestJsonFiles(): Promise<void> {
  const fileNames = await fs.readdir(__dirname);
  const testJsonFilePaths = fileNames
    .filter((fileName) => fileName.startsWith('test-file-') && fileName.endsWith('.json'))
    .map((fileName) => path.join(__dirname, fileName));
  await Promise.all(testJsonFilePaths.map((file) => fs.unlink(file)));
}

async function verifyFileContent(fileName: string, expectedContent: unknown): Promise<void> {
  const content = await fs.readFile(fileName, 'utf8');
  expect(JSON.parse(content)).toEqual(expectedContent);
}

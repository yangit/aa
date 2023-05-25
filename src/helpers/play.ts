import exec from './exec';
import path from 'path';

const soundDir = '../sounds/';
export default async (soundFile: string): Promise<void> => {
  const soundPath: string = path.resolve(__dirname, soundDir, soundFile);
  await exec(`afplay ${soundPath}`);
};

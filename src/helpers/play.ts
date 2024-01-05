import config from './config';
import exec from './exec';
import path from 'path';

export default async (soundFile: string): Promise<void> => {
  const soundPath: string = path.resolve(__dirname, config.soundDir, soundFile);
  await exec(`afplay ${soundPath}`);
};

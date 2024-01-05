import config from './config';
import exec from './exec';
import path from 'path';

export default async (): Promise<void> => {
  const scriptPath: string = path.resolve(config.assetsDir, 'start.ahcommand');
  await exec(`open -g ${scriptPath}`);
};

import exec from './exec';
import path from 'path';

export default async (): Promise<void> => {
  const scriptPath: string = path.resolve(__dirname, '../assets/start.ahcommand');
  await exec(`open -g ${scriptPath}`);
};

import { exec } from 'child_process';
import { log } from 'console';

export default async (cmd: string): Promise<{ stdout: string, stderr: string }> => await new Promise((resolve, reject) => {
  exec(cmd,
    (error, stdout, stderr) => {
      if (error !== null) {
        log(stdout, stderr);
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
});

import { spawn, exec } from 'child_process';

export default async (text: string): Promise<void> => {
  await new Promise((resolve, reject) => {
    if (text.length > 0) {
      const child = spawn('pbcopy');

      child.stdout.on('data', (data: string) => {
        console.log(`stdout: ${data}`);
      });

      child.stderr.on('data', (data: string) => {
        console.error(`stderr: ${data}`);
      });

      child.on('close', (code: number, signal) => {
        if (code !== 0) {
          reject(new Error(`code:${code}`));
        } else if (signal !== null) {
          reject(new Error(`signal:${signal}`));
        } else {
          resolve(undefined);
        }
      });

      child.stdin.write(text);
      child.stdin.end();
    } else {
      exec('pbcopy < /dev/null',
        (error, stdout, stderr) => {
          if (error !== null) {
            console.log(stdout, stderr);
            reject(error);
            return;
          }
          resolve(undefined);
        });
    }
  });
};

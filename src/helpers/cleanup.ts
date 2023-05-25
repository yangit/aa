import config from './config';
import recordStop from './recordStop';
import varToClip from './varToClip';
import fs from 'fs';

export default (): void => {
  varToClip('').then(() => { }, () => { });
  recordStop().then(() => {
    try {
      console.log('unlinking cleanup', config.recPath);

      fs.unlinkSync(config.recPath);
    } catch { }
  }, () => { });
};

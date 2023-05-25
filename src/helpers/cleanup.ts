import config from './config';
import recordStop from './recordStop';
import varToClip from './varToClip';
import fs from 'fs';

const cleanUp = (): void => {
  varToClip('').then(() => { }, () => { });
  recordStop().then(() => {
    try {
      fs.unlinkSync(config.recPath);
    } catch { }
  }, () => { });
};

export default cleanUp;

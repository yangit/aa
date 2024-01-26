import path from 'path';
const rootDir = process.env.NODE_ENV === 'development' ? './' : './';
export default {
  soundDir: path.resolve(rootDir, 'sounds'),
  assetsDir: path.resolve(rootDir, 'assets'),
  recPath: path.resolve(rootDir, 'rec/rec.mp3'),
  processingPath: path.resolve(rootDir, 'rec/recProcessing.mp3'),
  answerPath: path.resolve(rootDir, 'rec/'),
  permaStateFile: path.resolve(rootDir, 'rec/aaState.json'),
  // tailApp: 'BBEdit',
  tailApp: 'Sublime\\ Text',
};

import clipToVar from './clipToVar';
import cursorToClip from './cursorToClip';
import varToClip from './varToClip';

export default async (): Promise<string> => await varToClip('').then(async () => {
//   console.log('varToClip done');
  await cursorToClip();
}).then(async () => {
//   console.log('cursorToClip done');
  return await clipToVar();
});

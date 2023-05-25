import clipToVar from './clipToVar';
import cursorToClip from './cursorToClip';
import varToClip from './varToClip';

export default async (): Promise<string> => {
  await varToClip('');
  await cursorToClip();
  return await clipToVar();
};

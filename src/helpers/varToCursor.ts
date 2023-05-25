import clipToCursor from './clipToCursor';
import varToClip from './varToClip';

export default async (text: string): Promise<void> => {
  await varToClip(text);
  await clipToCursor();
};

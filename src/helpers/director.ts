import audioToText from './audioToText';
import config from './config';
import recordStart from './recordStart';
import * as fs from 'fs';
import recordStop from './recordStop';
import varToCursor from './varToCursor';
import cursorToVar from './cursorToVar';
import permaState from './permaState';
import { type Conversation } from '../types';
import askToFile from './askToFile';
import isCursor from './isCursor';
import getConversation from './getConversation';
import exec from './exec';
import path from 'path';
import playInst from './playInst';
import getUserQuestion from './getUserQuestion';
import handler from './handler';

const model = 'gpt-4';
const minusC = /^-c:(\d+)(?: |\n|$)/;

let recording = false;
let recordingBusy = false;
export const toggleRecord = async (): Promise<void> => {
  console.log('toggleRecord', recording);

  recording = !recording;
  if (recordingBusy) {
    console.log('Ignoring command because recording busy');
    playInst('water.mp3');

    return;
  }

  recordingBusy = true;

  if (!recording) {
    playInst('click.wav');
    try {
      console.log('unlinking remove', config.recPath);
      fs.unlinkSync(config.recPath);
    } catch { }
    await recordStart();
    recordingBusy = false;
  } else {
    playInst('sending.mp3');
    await recordStop();
    const voice = await audioToText();
    playInst('done.mp3');
    await varToCursor(voice).then(() => { }, (err) => { throw err; });
    recordingBusy = false;
  };
};
export const askAtCursor = async (): Promise<void> => {
  playInst('click.wav');
  // list conversations
  const clip = await cursorToVar();

  if (clip.startsWith('-l')) {
    console.log('Listing conversations');
    const conversaionList = permaState.get().map(
      (conversation, cIndex) => `-c:${cIndex} ${getUserQuestion(conversation.messages).slice(0, 200)}`,
    ).join('\n\n');
    await varToCursor(conversaionList).then(() => { }, (err) => { throw err; });
    return;
  }

  // open conversation
  if (minusC.test(clip)) {
    console.log('Opening conversation');
    const conversationId = clip.match(minusC)?.[1];
    if (typeof conversationId === 'string') {
      const conversationFile: string = path.resolve(config.answerPath, `c${conversationId}.txt`);
      await exec(`open -a ${config.tailApp} ${conversationFile}`);
    }
    return;
  }

  // conversation
  let conversation: Conversation;
  const continuing = isCursor(clip.split('\n')[0]);
  if (continuing) {
    conversation = getConversation(clip.split('\n')[0]);
    conversation.messages.push({ role: 'user', content: clip.split('\n').slice(1).join('\n') });
  } else {
    conversation = { model, messages: [{ role: 'user', content: clip }] };
  }
  // console.log('conversation', continuing, conversation);

  if (clip.length > 0) {
    permaState.add(conversation);
    askToFile(conversation, () => { playInst('chimes.mp3'); }).then(() => { playInst('done.mp3'); }, handler);
  } else {
    console.log('No text, nothing to ask');
    playInst('water.mp3');
  }
};

import audioToText from './audioToText';
import config from './config';
import recordStart from './recordStart';
import * as fs from 'fs';
import recordStop from './recordStop';
// import state from './state';
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

// const clicks: Date[] = [new Date()];
// let currentIndex = 0;
// const tick = async (): Promise<void> => {
//   if (!state.get().running && clicks.length > currentIndex + 1) {
//     state.set('running', true);
//     currentIndex += 1;
//     if (state.get().alfredClick === 'rest') {
//       playInst('click.wav');
//       await cursorToVar().then((text) => {
//         console.log('setting clip before rec', text);
//         state.set('clip', text);
//       });

//       const clip = state.get().clip;
//       const voice = '';

//       console.log('Siri mode', state.get());

//       if (clip.startsWith('-l')) {
//         console.log('Listing conversations');

//         const conversaionList = permaState.get().map(
//           (conversation, cIndex) => `-c:${cIndex} ${getUserQuestion(conversation.messages).slice(0, 200)}`,
//         ).join('\n\n');
//         await varToCursor(conversaionList).then(() => { }, (err) => { throw err; });
//         state.set('alfredClick', 'rest');
//         state.set('running', false);
//         nextClick();
//         return;
//       }
//       const minusC = /^-c:(\d+)(?: |\n|$)/;
//       if (minusC.test(clip)) {
//         console.log('Opening conversation');
//         const conversationId = clip.match(minusC)?.[1];
//         if (typeof conversationId === 'string') {
//           const conversationFile: string = path.resolve(config.answerPath, `c${conversationId}.txt`);
//           await exec(`open -a ${config.tailApp} ${conversationFile}`);
//         }

//         state.set('alfredClick', 'rest');
//         state.set('running', false);
//         nextClick();
//         return;
//       }
//       // conversation
//       let conversation: Conversation;

//       if (isCursor(clip.split('\n')[0])) {
//         // detect if we are continuing a conversation
//         conversation = getConversation(clip.split('\n')[0]);

//         if (voice.length > 0) {
//           conversation.messages.push({ role: 'user', content: voice });
//         }
//         if (clip.split('\n').length > 1) {
//           conversation.messages.push({ role: 'user', content: clip.split('\n').slice(1).join('\n') });
//         }
//         if (clip.split('\n').length > 1 || voice.length > 0) {
//           askToFile(conversation, () => { playInst('chimes.mp3'); }).then(() => { playInst('done.mp3'); }, handler);
//         } else {
//           console.log('No voice or clip');
//           playInst('water.mp3');
//         }
//         state.set('alfredClick', 'rest');
//         state.set('running', false);
//         nextClick();
//         return;
//       } else {
//         // start a new conversation
//         conversation = { model, messages: [] };
//         if (clip.length > 0) {
//           conversation.messages.push({ role: 'user', content: clip });
//         }
//         if (clip.length > 0 || voice.length > 0) {
//           permaState.add(conversation);
//           // throw new Error('Sho return!!'); // eslint-disable-line
//           askToFile(conversation, () => { playInst('chimes.mp3'); }).then(() => { playInst('chimes.mp3'); }, handler);
//         } else {
//           console.log('No voice or clip');
//         }
//         state.set('alfredClick', 'rest');
//         state.set('running', false);
//         nextClick();
//         return;
//       }
//     }
//     // if (state.get().alfredClick === 'rest') {
//     //   playInst('click.wav');
//     //   try {
//     //     console.log('unlinking remove', config.recPath);
//     //     fs.unlinkSync(config.recPath);
//     //   } catch { }
//     //   await Promise.all([
//     //     cursorToVar().then((text) => {
//     //       console.log('setting clip beofre rec', text);
//     //       state.set('clip', text);
//     //     }),
//     //     recordStart(),
//     //   ]);
//     //   state.set('alfredClick', 'recording');
//     //   state.set('running', false);
//     //   nextClick();
//     //   return;
//     // }

//     if (state.get().alfredClick === 'recording') {
//       playInst('sending.mp3');
//       await recordStop();
//       const diff = Math.abs(clicks[currentIndex].getTime() - clicks[currentIndex - 1].getTime()) / 1000;
//       console.log('diff', diff);

//       let voice = '';
//       let isSiri = false;
//       if (diff > 2) {
//         console.log('Voice from file');
//         voice = await audioToText();
//         if (voice.toLowerCase().startsWith('siri')) {
//           voice = voice.replace(/^(Siri[!?,.:;]? )/i, '');
//           isSiri = true;
//         }
//         console.log('Voice', voice);
//       } else {
//         console.log('No voice, siri true');

//         isSiri = true;
//       }

//       const clip = state.get().clip;
//       if (clip.length === 0 && !isSiri) {
//         // voice to text
//         playInst('done.mp3');
//         await varToCursor(voice);
//         state.set('alfredClick', 'rest');
//         state.set('running', false);
//         nextClick();
//         return;
//       } else {
//         console.log('Siri mode', state.get());

//         if (clip.startsWith('-l')) {
//           console.log('Listing conversations');

//           const conversaionList = permaState.get().map(
//             (conversation, cIndex) => `-c:${cIndex} ${getUserQuestion(conversation.messages).slice(0, 200)}`,
//           ).join('\n\n');
//           await varToCursor(conversaionList).then(() => {}, (err) => { throw err; });
//           state.set('alfredClick', 'rest');
//           state.set('running', false);
//           nextClick();
//           return;
//         }
//         const minusC = /^-c:(\d+)(?: |\n|$)/;
//         if (minusC.test(clip)) {
//           console.log('Opening conversation');
//           const conversationId = clip.match(minusC)?.[1];
//           if (typeof conversationId === 'string') {
//             const conversationFile: string = path.resolve(config.answerPath, `c${conversationId}.txt`);
//             await exec(`open -a ${config.tailApp} ${conversationFile}`);
//           }

//           state.set('alfredClick', 'rest');
//           state.set('running', false);
//           nextClick();
//           return;
//         }
//         // conversation
//         let conversation: Conversation;

//         if (isCursor(clip.split('\n')[0])) {
//           // detect if we are continuing a conversation
//           conversation = getConversation(clip.split('\n')[0]);

//           if (voice.length > 0) {
//             conversation.messages.push({ role: 'user', content: voice });
//           }
//           if (clip.split('\n').length > 1) {
//             conversation.messages.push({ role: 'user', content: clip.split('\n').slice(1).join('\n') });
//           }
//           if (clip.split('\n').length > 1 || voice.length > 0) {
//             askToFile(conversation, () => { playInst('chimes.mp3'); }).then(() => { playInst('done.mp3'); }, handler);
//           } else {
//             console.log('No voice or clip');
//             playInst('water.mp3');
//           }
//           state.set('alfredClick', 'rest');
//           state.set('running', false);
//           nextClick();
//           return;
//         } else {
//           // start a new conversation
//           conversation = { model, messages: [] };
//           if (voice.length > 0) {
//             conversation.messages.push({ role: 'user', content: voice });
//           }
//           if (clip.length > 0) {
//             conversation.messages.push({ role: 'user', content: clip });
//           }
//           if (clip.length > 0 || voice.length > 0) {
//             permaState.add(conversation);
//             // throw new Error('Sho return!!'); // eslint-disable-line
//             askToFile(conversation, () => { playInst('chimes.mp3'); }).then(() => { playInst('chimes.mp3'); }, handler);
//           } else {
//             console.log('No voice or clip');
//           }
//           state.set('alfredClick', 'rest');
//           state.set('running', false);
//           nextClick();
//           return;
//         }
//         // permaState.get().map((conversation)=>{
//         //   if (typeof conversation.title==='undefined') {
//         //     return
//         //   }
//         //   return Promise.resolve()
//         // })
//       }
//       throw new Error('Should never happen, because return!!'); // eslint-disable-line
//     }
//   }
// };

// const nextClick = (): void => {
//   setImmediate(() => {
//     tick().then(() => {}, handler);
//   });
// };

// export default async ({ action }: { askAtCursor?: boolean, toggleRecord?: boolean }): Promise<void> => {
//   if (typeof askAtCursor === 'boolean' && askAtCursor) {
//     return askAtCursor();
//     // clicks.push(new Date());
//     // nextClick();
//   }
// };

import audioToText from './audioToText';
import config from './config';
import recordStart from './recordStart';
import recordStop from './recordStop';
import state from './state';
import * as fs from 'fs';
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
import cleanUp from './cleanup';

const model = 'gpt-4';

const clicks: Date[] = [new Date()];
let currentIndex = 0;

const nextClick = (): void => {
  setImmediate(() => {
    (async (): Promise<void> => {
      if (!state.get().running && clicks.length > currentIndex + 1) {
        state.set('running', true);
        currentIndex += 1;

        if (state.get().alfredClick === 'rest') {
          playInst('click.wav');
          try {
            console.log('unlinking remove', config.recPath);
            fs.unlinkSync(config.recPath);
          } catch { }
          await Promise.all([
            cursorToVar().then((text) => {
              console.log('setting clip beofre rec', text);
              state.set('clip', text);
            }),
            recordStart(),
          ]);
          state.set('alfredClick', 'recording');
          state.set('running', false);
          nextClick();
          return;
        }

        if (state.get().alfredClick === 'recording') {
          playInst('sending.mp3');
          await recordStop();
          const diff = Math.abs(clicks[currentIndex].getTime() - clicks[currentIndex - 1].getTime()) / 1000;
          console.log('diff', diff);

          let voice = '';
          let isSiri = false;
          if (diff > 2) {
            console.log('Voice from file');
            voice = await audioToText();
            if (voice.toLowerCase().startsWith('siri')) {
              voice = voice.replace(/^(Siri[!?,.:;]? )/i, '');
              isSiri = true;
            }
            console.log('Voice', voice);
          } else {
            console.log('No voice, siri true');

            isSiri = true;
          }

          const clip = state.get().clip;
          if (clip.length === 0 && !isSiri) {
            // voice to text
            playInst('done.mp3');
            await varToCursor(voice);
            state.set('alfredClick', 'rest');
            state.set('running', false);
            nextClick();
            return;
          } else {
            console.log('Siri mode', state.get());

            if (clip.startsWith('-l')) {
              console.log('Listing conversations');

              const conversaionList = permaState.get().map(
                (conversation, cIndex) => `-c:${cIndex} ${getUserQuestion(conversation.messages).slice(0, 200)}`,
              ).join('\n\n');
              await varToCursor(conversaionList).then(() => {}, (err) => { throw err; });
              state.set('alfredClick', 'rest');
              state.set('running', false);
              nextClick();
              return;
            }
            const minusC = /^-c:(\d+)(?: |\n|$)/;
            if (minusC.test(clip)) {
              console.log('Opening conversation');
              const conversationId = clip.match(minusC)?.[1];
              if (typeof conversationId === 'string') {
                const conversationFile: string = path.resolve(config.answerPath, `c${conversationId}.txt`);
                await exec(`open -a ${config.tailApp} ${conversationFile}`);
              }

              state.set('alfredClick', 'rest');
              state.set('running', false);
              nextClick();
              return;
            }
            // conversation
            let conversation: Conversation;

            if (isCursor(clip.split('\n')[0])) {
              // detect if we are continuing a conversation
              conversation = getConversation(clip.split('\n')[0]);

              if (voice.length > 0) {
                conversation.messages.push({ role: 'user', content: voice });
              }
              if (clip.split('\n').length > 1) {
                conversation.messages.push({ role: 'user', content: clip.split('\n').slice(1).join('\n') });
              }
              if (clip.split('\n').length > 1 || voice.length > 0) {
                askToFile(conversation, () => { playInst('chimes.mp3'); }).then(() => { playInst('done.mp3'); }, (err) => { throw err; });
              } else {
                console.log('No voice or clip');
                playInst('water.mp3');
              }
              state.set('alfredClick', 'rest');
              state.set('running', false);
              nextClick();
              return;
            } else {
              // start a new conversation
              conversation = { model, messages: [] };
              if (voice.length > 0) {
                conversation.messages.push({ role: 'user', content: voice });
              }
              if (clip.length > 0) {
                conversation.messages.push({ role: 'user', content: clip });
              }
              if (clip.length > 0 || voice.length > 0) {
                permaState.add(conversation);
                askToFile(conversation, () => { playInst('chimes.mp3'); }).then(() => { playInst('chimes.mp3'); }, (err) => { throw err; });
              } else {
                console.log('No voice or clip');
              }
              state.set('alfredClick', 'rest');
              state.set('running', false);
              nextClick();
              return;
            }
            // permaState.get().map((conversation)=>{
            //   if (typeof conversation.title==='undefined') {
            //     return
            //   }
            //   return Promise.resolve()
            // })
          }
          throw new Error('Should never happen, because return!!'); // eslint-disable-line
        }
      }
    })().then(() => {}, (err) => {
      cleanUp();
      state.set('alfredClick', 'rest');
      state.set('running', false);
      console.log('Err:', err, err?.response?.data?.error);
      playInst('water.mp3');
    });
  });
};
export default async ({ alfredClick }: { alfredClick: boolean }): Promise<void> => {
  if (alfredClick) {
    clicks.push(new Date());
    nextClick();
  }
};

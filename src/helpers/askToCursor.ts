// import { type Conversation } from '../types';
// import ask from './ask';
// import play from './play';
// import varToCursor from './varToCursor';

// export default async (conversation: Conversation): Promise<string> => await new Promise((resolve, reject) => {
//   const bufferQueue: string[] = [];
//   let running = false;
//   let startedStreaming = false;
//   let doneStreaming = false;
//   let answerLocal: string = '';
//   const pingBuffer = (): void => {
//     if (running) return;
//     // console.log({ running, doneStreaming }, bufferQueue);
//     running = true;
//     if (bufferQueue.length === 0) {
//       throw new Error('Buffer queue is empty');
//     }
//     if (bufferQueue.length > 0) {
//       const text = bufferQueue.join('');
//       bufferQueue.length = 0;
//       varToCursor(text).then(() => {
//         running = false;
//         if (bufferQueue.length > 0) {
//           setImmediate(() => { pingBuffer(); });
//         }
//         if (bufferQueue.length === 0 && doneStreaming) {
//           resolve(answerLocal);
//         }
//       }, (err) => { reject(err); });
//     }
//   };

//   ask({
//     conversation,
//     onMessage: (text) => {
//       if (!startedStreaming) {
//         startedStreaming = true;
//       }
//       bufferQueue.push(text);
//       pingBuffer();
//     },
//   }).then((result) => {
//     doneStreaming = true;
//     answerLocal = result;
//     console.log('answer:', answerLocal);
//   }, (err) => { reject(err); });
// });

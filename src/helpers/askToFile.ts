import { type Conversation } from '../types';
import ask from './ask';
import config from './config';
import exec from './exec';
import path from 'path';
import * as fs from 'fs';
import getCursor from './getCursor';
import permaState from './permaState';

const getNewAnswerFileName = (conversation: Conversation): string => {
  const { answerPath } = config;
  const conversationId = permaState.get().indexOf(conversation);

  return path.resolve(answerPath, `c${conversationId}.txt`);
};

export default async (conversation: Conversation, onStart: () => void): Promise<string> => {
  const newAnswerFileName = getNewAnswerFileName(conversation);
  const answerStream = fs.createWriteStream(newAnswerFileName);
  const previous = conversation.messages.map(({ content }, mIndex) => `${content}\n${getCursor(conversation, mIndex)}`).join('\n');

  answerStream.write(`${previous}\n`);
  const cmd = `open -a ${config.tailApp} ${newAnswerFileName}`;
  console.log(cmd);

  await exec(cmd);
  let startedStreaming = false;
  const answer = await ask({
    conversation,
    onMessage: (text) => {
      answerStream.write(text);
      if (!startedStreaming) {
        startedStreaming = true;
        onStart();
      }
    },
  });
  conversation.messages.push({ role: 'assistant', content: answer });
  permaState.save();
  answerStream.write(`\n${getCursor(conversation)}\n`);
  answerStream.close();
  return answer;
};

import { type Conversation } from '../types';
import isCursor from './isCursor';
import permaState from './permaState';

export default (cursor: string): Conversation => {
  if (!isCursor(cursor)) {
    throw new Error('Invalid cursor');
  }
  const conversationId = parseInt(cursor.slice(1).split('m')[0], 10);
  const messageId = parseInt(cursor.slice(1).split('m')[1], 10);
  const conversation = permaState.get()[conversationId];
  if (messageId === conversation.messages.length - 1) {
    console.log('Returning conversation');
    return conversation;
  } else {
    console.log('Forking conversation');
    const forkedConversation = JSON.parse(JSON.stringify(conversation));
    permaState.add(forkedConversation);
    forkedConversation.messages.length = messageId + 1;
    return forkedConversation;
  }
};

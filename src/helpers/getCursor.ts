import { type Conversation } from '../types';
import permaState from './permaState';

export default (conversation: Conversation, mIndex?: number): string => {
  const conversationId = permaState.get().indexOf(conversation);
  const messageId = conversation.messages.length - 1;
  return `c${conversationId}m${typeof mIndex === 'number' ? mIndex : messageId}`;
};

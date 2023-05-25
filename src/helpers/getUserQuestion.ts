import { type Message } from '../types';

const getUserQuestion = (messages: Message[]): string => {
  let concatenatedMessage = '';

  for (const message of messages) {
    if (message.role === 'user') {
      concatenatedMessage += message.content;
    } else if (message.role === 'assistant') {
      break;
    }
  }

  return concatenatedMessage;
};
export default getUserQuestion;

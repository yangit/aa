import { type Conversation } from '../types';
import ask from './ask';
import getUserQuestion from './getUserQuestion';

export default async (conversation: Conversation): Promise<string> => {
  const question = getUserQuestion(conversation.messages);

  const prompt = 'Generate 20-word summary of the user request below:';

  const summary = await ask({
    conversation: {
      model: 'gpt-4',
      messages: [
        { role: 'user', content: prompt },
        { role: 'user', content: question },
      ],
    },
  });
  return summary;
};

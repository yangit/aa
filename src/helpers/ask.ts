import { type Conversation } from '../types';
// @ts-expect-error no types
import EventSource from './eventsource';
import state from './state';

export default async (
  { conversation, onMessage = () => {} }:
  { conversation: Conversation, onMessage?: (text: string) => void },
): Promise<string> => {
  return await new Promise((resolve, reject) => {
    const data = {
      model: conversation.model,
      messages: conversation.messages.map((message) => ({ role: message.role, content: message.content.replace(/\n/g, ' ') })),
      stream: true,
    };

    const dataJson = JSON.stringify(data);

    // Read OpenAI API key from file and set authorization header for API request
    const token = process.env.OPENAI_API_KEY;
    if (typeof token === 'undefined') {
      throw new Error('Token openAI is not given');
    }

    // Set options for HTTPS request to OpenAI API
    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': dataJson.length,
        Authorization: `Bearer ${token}`,
      },
    };
    interface Choice {
      finish_reason: string
      index: number
      delta: {
        content: string
        role: string
      }
    }
    let response = '';
    interface ChoicesEvent { data: string }
    const es = new EventSource(options, dataJson);
    const stop = (): void => {
      resolve(response);
      es.close();
      state.set('stop', undefined);
    };
    state.set('stop', stop);
    const listener = (event: ChoicesEvent): void => {
      try {
        if (event.data === '[DONE]') {
          stop();
          return;
        }
        JSON.parse(event.data).choices.forEach((choice: Choice) => {
          try {
            if (choice.finish_reason === 'stop') {
              // es.removeEventListener('message', listener);
              return;
            }
            if (choice.index !== 0) {
              console.log(JSON.stringify(choice));
              throw new Error('choice.index is not 0');
            }
            if (typeof choice.delta.content === 'undefined' && choice.delta.role !== 'assistant') {
              console.log(JSON.stringify(choice));
              throw new Error('No content in choice');
            }
            if (choice.delta.content?.length > 0) {
              onMessage(choice.delta.content);
              response = `${response}${choice.delta.content}`;
            }
          } catch (error) {
            console.log(choice);

            reject(error);
          }
        });
      } catch (error) {
        console.log(event.data);

        reject(error);
      }
    };
    es.addEventListener('message', listener);
    es.addEventListener('error', (event: any) => {
      console.log(options);
      console.log(JSON.stringify(data, null, '\t'));
      console.log('ERRRRORR:', event);
      reject(event);
    });
  });
};

import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import config from './config';

export default async (): Promise<string> => {
  const openAiApiKey = process.env.OPENAI_API_KEY;
  if (typeof openAiApiKey === 'undefined') {
    throw new Error('Open AI key is undefined');
  }

  const form = new FormData();
  form.append('file', fs.createReadStream(config.recPath));
  form.append('model', 'whisper-1');

  return await axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
    headers: {
      ...form.getHeaders(),
      Authorization: `Bearer ${openAiApiKey}`,
    },
  }).then((response) => response.data.text);
};

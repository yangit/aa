import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import config from './config';
const openAiApiKey = process.env.OPENAI_API_KEY;
if (typeof openAiApiKey === 'undefined') {
  throw new Error('Open AI key is undefined');
}

const getData = async (retries: number): Promise<string> => {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(config.recPath));
    form.append('model', 'whisper-1');
    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${openAiApiKey}`,
      },
    });
    return response.data.text;
  } catch (error) {
    // playInst()
    if (retries === 0) {
      throw error;
    }
    console.log(`Retrying voice2text Attempts remaining: ${retries - 1}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return await getData(retries - 1);
  }
};

export default async (): Promise<string> => {
  return await getData(3);
};

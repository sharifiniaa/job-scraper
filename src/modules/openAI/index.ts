import {sendMessageToBot} from '../telegram';
import {Configuration, OpenAIApi} from 'openai';

export async function getCoverLetter(jobDescription: string, chatId: number, info: string) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const res = await openai.createCompletion(
      {
        model: 'text-davinci-003',
        prompt: `${info} write cover letter for below job description:\n ${jobDescription}`,
        max_tokens: 1000,
        temperature: 0.5,
        stream: true,
      },
      {responseType: 'stream'},
    );
    console.log(jobDescription, 'JOB Description');

    let response = '';
    // @ts-ignore
    res.data.on('data', (data: any) => {
      const lines = data
        .toString()
        .split('\n')
        .filter((line: string) => line.trim() !== '');
      for (const line of lines) {
        const message = line.replace(/^data: /, '');
        if (message.trim() === '[DONE]') {
          console.log(response.trim(), 'generated cover letter finished!');
          sendMessageToBot(response, chatId);
          return; // Stream finished
        }
        try {
          const parsed = JSON.parse(message);
          response += parsed.choices[0].text;
        } catch (error) {
          console.error('Could not JSON parse stream message', message, error);
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
}

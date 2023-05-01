require('dotenv').config();
import {companyLogoMapper} from '../../helper/countryMapper';
import TelegramBot from 'node-telegram-bot-api';
import {Job} from 'prisma/prisma-client';
import {getDescription} from '../scraper/getDescription';
import {getCoverLetter} from '../openAI';

const botToken = `${process.env.TELEGRAM_BOT_TOKEN}`;
const channelName = `${process.env.TELEGRAM_CHANNEL_NAME}`;
const bot = new TelegramBot(botToken, {polling: true});

export const sendJobToChannel = async (job: Job, count: number, total: number) => {
  try {
    const convertedDate = new Date(job.created_date!);
    const chat = await bot.getChat(channelName);
    const message = `<b>🌟${String(job.title).toLocaleUpperCase()}</b>\n\nCompany: ${
      job.company
    }\n\nLocation: ${companyLogoMapper(job.location as string)}\n\n📆 Date: <i>${
      convertedDate.toLocaleDateString() + ' ' + convertedDate.toLocaleTimeString()
    }</i>\n${job.description ? `\n🔹Description: <i>${job.description}</i>\n\n` : ''}\nSource:${
      job.source === 'linkedin' ? '<strong>LinkedIn</strong>' : ''
    }\n${job.visa ? '<u>🌐#visa</u>\n' : ''}`;
    const keyboard = {
      inline_keyboard: [[{text: 'View Job & Apply', url: job.link}]],
    };
    setTimeout(async () => {
      await bot.sendMessage(chat.id, message, {reply_markup: keyboard, parse_mode: 'HTML', disable_notification: true});
      console.log('sent to telegram', `${count}/${total} (TOTAL(not filtered))`);
    }, count * 5000);
  } catch (err) {
    console.log(err);
  }
};

export const generateCoverLetter = () => {
  bot.onText(/\/coverletter (.+)/, async (msg, match: RegExpExecArray | null) => {
    console.log(match);
    if (!match) {
      bot.sendMessage(msg.chat.id, 'Invalid command format. Please use the format: /coverletter <job id>');
      return;
    }

    const response = await getDescription(+match[1]);
    if (!response) {
      bot.sendMessage(msg.chat.id, 'job description is not exist' + response);
      return;
    }

    try {
      bot.sendMessage(msg.chat.id, 'loading...');
      await getCoverLetter(response, msg.chat.id);
    } catch (error) {
      console.error(error);
      bot.sendMessage(msg.chat.id, 'Failed to generate cover letter.');
    }
  });
};



export const sendMessageToBot = async (message: string, chatId: number) => {
  try {
    bot.sendMessage(chatId, message);
  } catch (err) {
    console.log(err);
  }
};

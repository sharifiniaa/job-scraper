require('dotenv').config();
import TelegramBot from 'node-telegram-bot-api';

import {TJob} from '../../types';

const botToken = `${process.env.TELEGRAM_BOT_TOKEN}`;
const channelName = `${process.env.TELEGRAM_CHANNEL_NAME}`;
const bot = new TelegramBot(botToken);

// Function to send a job message to the Telegram channel

export const sendJobToChannel = async (jobs: TJob[]) => {
  try {
    const chat = await bot.getChat(channelName);
    for (const job of jobs) {
      const message = `${job.title}\nCompany: ${job.company}\nLocation: ${job.location}\nDescription: ${
        job.description
      }\n${job.visa ? '#visa\n' : ''}Source: ${job.source}`;
      const keyboard = {
        inline_keyboard: [[{text: 'View Job', url: job.link}]],
      };
      await bot.sendMessage(chat.id, message, {reply_markup: keyboard});
    }
  } catch (err) {
    console.log(err);
  }
};

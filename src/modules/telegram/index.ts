require('dotenv').config();
import TelegramBot from 'node-telegram-bot-api';
import {delay} from '../../helper/delay';
import {cleanedText} from '../../helper/cleanedText';
import {TJob} from '../../types';

const botToken = `${process.env.TELEGRAM_BOT_TOKEN}`;
const channelName = `${process.env.TELEGRAM_CHANNEL_NAME}`;
const bot = new TelegramBot(botToken);

// Function to send a job message to the Telegram channel

export const sendJobToChannel = async (job: TJob, delayInMs: number) => {
  try {
    const convertedDate = new Date();
    const chat = await bot.getChat(channelName);
    // for (const job of jobs) {
    const message = `<b>🌟${job.title}</b>\n\nCompany: ${job.company}\n\nLocation: 🇬🇧<b>${job.location}\n\n📆Date: <i>${
      convertedDate.toLocaleDateString() + ' ' + convertedDate.toLocaleTimeString()
    }</i></b>\n\n🔹Description: <i>${job.description}</i>\n\n\nSource:${
      job.source === 'linkedin' ? '<strong>LinkedIn</strong>' : ''
    }\n${job.visa ? '<u>🌐#visa</u>\n' : ''}`;
    const keyboard = {
      inline_keyboard: [[{text: 'View Job & Apply', url: job.link}]],
    };
    setTimeout(async () => {
      await bot.sendMessage(chat.id, message, {reply_markup: keyboard, parse_mode: 'HTML'});
      console.log(job.title, 'sent to telegram');
    }, delayInMs);
    // }
  } catch (err) {
    console.log(err);
  }
};

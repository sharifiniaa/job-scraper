require('dotenv').config();
import {companyLogoMapper} from '../../helper/countryMapper';
import TelegramBot from 'node-telegram-bot-api';
import {Job} from 'prisma/prisma-client';

const botToken = `${process.env.TELEGRAM_BOT_TOKEN}`;
const channelName = `${process.env.TELEGRAM_CHANNEL_NAME}`;
const bot = new TelegramBot(botToken);

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

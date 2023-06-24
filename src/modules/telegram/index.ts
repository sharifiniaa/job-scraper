require('dotenv').config();
import {companyLogoMapper} from '../../helper/countryMapper';
import TelegramBot from 'node-telegram-bot-api';
import {Job} from 'prisma/prisma-client';
import {getDescription} from '../scraper/getDescription';
import {getCoverLetter} from '../openAI';
import prisma from '../db';
import {scraper} from '../scraper';
import {collectCompanies} from '../companies';

const botToken = `${process.env.TELEGRAM_BOT_TOKEN}`;
const channelName = `${process.env.TELEGRAM_CHANNEL_NAME}`;
const bot = new TelegramBot(botToken, {polling: true});
let isActionRunning = false;

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
    }\n${job.visa ? '<u>🌐#visa</u>' : ''}\n 🆔 <code>${job.id}</code>`;
    const keyboard = {
      inline_keyboard: [
        [
          {text: 'View Job & Apply', url: job.link},
          {
            text: 'Generate cover letter',
            url: `https://t.me/${process.env.TELEGRAM_BOT_NAME}?start=cover-letter-${job.id}`,
          },
        ],
      ],
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
    if (isActionRunning) {
      bot.sendMessage(msg.chat.id, 'Sorry, a previous action is still running. Please wait... 🎲');
      return;
    }
    isActionRunning = true;

    if (!match) {
      bot.sendMessage(msg.chat.id, 'Invalid command format. Please use the format: /coverletter <job id>');
      return;
    }

    console.log(`Request for cover letter by job id ${match?.[1]}`);
    const response = await getDescription(+match[1]);
    if (!response) {
      bot.sendMessage(msg.chat.id, 'job description is not exist' + response);
      return;
    }

    try {
      const information = await prisma.information.findFirst();
      bot.sendMessage(msg.chat.id, information ? 'loading...' : 'information is not found');
      if (information) await getCoverLetter(response, msg.chat.id, information?.description);
    } catch (error) {
      console.error(error);
      bot.sendMessage(msg.chat.id, 'Failed to generate cover letter.');
    } finally {
      isActionRunning = false;
    }
  });
};

export const getUserInformation = () => {
  bot.onText(/\/information (.+)/, async (msg, match: RegExpExecArray | null) => {
    if (isActionRunning) {
      bot.sendMessage(msg.chat.id, 'Sorry, a previous action is still running. Please wait... 🎲');
      return;
    }
    isActionRunning = true;
    if (!match || !match[1]) {
      bot.sendMessage(msg.chat.id, 'Invalid command format. Please use the format: /information <user information>');
      return;
    }

    try {
      const isInformationExist = await prisma.information.findFirst();
      if (!!isInformationExist) {
        throw new Error('you have information please remove or edit!');
      }
      const information = await prisma.information.create({data: {description: match[1]}});
      if (information) {
        bot.sendMessage(msg.chat.id, 'Your data saved...');
        return;
      }
      throw new Error("Your information Can't saved please check your message!");
    } catch (error) {
      bot.sendMessage(msg.chat.id, (error as Error)?.message || 'failed to save data please try few minutes later!');
    } finally {
      isActionRunning = false;
    }
  });
};

export const updateInformation = () => {
  bot.onText(/\/information_update (.+)/, async (msg, match: RegExpExecArray | null) => {
    if (isActionRunning) {
      bot.sendMessage(msg.chat.id, 'Sorry, a previous action is still running. Please wait... 🎲');
      return;
    }
    isActionRunning = true;
    if (!match || !match[1]) {
      bot.sendMessage(msg.chat.id, 'Invalid command format. Please use the format: /information <user information>');
      return;
    }

    try {
      const information = await prisma.information.findFirst();
      if (information) {
        const response = await prisma.information.update({
          data: {description: match[1]},
          where: {id: information.id},
        });
        if (response) {
          bot.sendMessage(msg.chat.id, 'Your data updated successfully...');
        }
        return;
      }
      bot.sendMessage(msg.chat.id, 'You must first add information with /information <message>');
    } catch (error) {
      bot.sendMessage(msg.chat.id, 'failed to save data please try few minutes later!');
    } finally {
      isActionRunning = false;
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

export const startScarpData = () => {
  bot.onText(/\/start (.+)/, async (msg, match: RegExpExecArray | null) => {
    if (isActionRunning) {
      bot.sendMessage(msg.chat.id, 'Sorry, a previous action is still running. Please wait... 🎲');
      return;
    }
    isActionRunning = true;
    if (!match || !match[1]) {
      bot.sendMessage(msg.chat.id, 'Your arguments is not valid');
      return;
    }

    if (match[0].includes('cover-letter')) {
      const jobId = match[0].split('-')?.[2];
      const response = await getDescription(+jobId);
      if (!response) {
        bot.sendMessage(msg.chat.id, 'job description is not exist' + response);
        return;
      }

      try {
        const information = await prisma.information.findFirst();
        bot.sendMessage(msg.chat.id, information ? 'loading...' : 'information is not found');
        if (information) await getCoverLetter(response, msg.chat.id, information?.description);
      } catch (error) {
        console.error(error);
        bot.sendMessage(msg.chat.id, 'Failed to generate cover letter.');
      } finally {
        isActionRunning = false;
      }
      return;
    }

    const args = match?.[1]?.split('-');
    const locations = args?.[0]?.trim()?.split(',');
    const keyword = args?.[1]?.trim();

    try {
      if (locations && keyword) {
        bot.sendMessage(msg.chat.id, 'Your script is running 🎰');
        await scraper(locations, keyword, false, bot, msg.chat.id);
      }
    } catch (err) {
      console.log(err);
      bot.sendMessage(msg.chat.id, 'There are some problem on running scraper!');
    } finally {
      isActionRunning = false;
    }
  });
};

export const gatheringCompanies = () => {
  bot.onText(/\/companies/, async msg => {
    try {
      if (isActionRunning) {
        bot.sendMessage(msg.chat.id, 'Sorry, a previous action is still running. Please wait... 🎲');
        return;
      }
      bot.sendMessage(msg.chat.id, 'gathering data please wait... 🌘');
      const data = await collectCompanies();
      if (!data) {
        throw new Error('cant find data!');
      }
      const {relocateCom, siaExplains, newCompanies} = data;
      bot.sendMessage(
        msg.chat.id,
        `relocateMe:${relocateCom.companies} companies found \n
        siaExplains: ${siaExplains.companies} \n
        ${newCompanies} of them are new!🌝
        `,
      );
    } catch (err) {
      bot.sendMessage(msg.chat.id, (err as Error)?.message || 'failed to find data please try few minutes later!');
    } finally {
      isActionRunning = false;
    }
  });
};

export const getJD = () => {
  bot.onText(/\/jd (.+)/, async (msg, match: RegExpExecArray | null) => {
    if (isActionRunning) {
      bot.sendMessage(msg.chat.id, 'Sorry, a previous action is still running. Please wait... 🎲');
      return;
    }
    isActionRunning = true;

    if (!match || !match[0]) {
      bot.sendMessage(msg.chat.id, 'Invalid command format. Please use the format: /jd <jobId>');
      return;
    }

    try {
      const jobId = +match[1];
      const jobDescription = await prisma.job.findUnique({
        where: {
          id: jobId,
        },
      });
      if (jobDescription?.description) {
        const code = `${jobDescription.description}`;
        await bot.sendMessage(msg.chat.id, code);
        return;
      }
      const scrapJd = await getDescription(jobId);
      bot.sendMessage(msg.chat.id, scrapJd ? String(scrapJd) : 'nothing found!');
    } catch (error) {
      bot.sendMessage(msg.chat.id, 'failed to save data please try few minutes later!');
    } finally {
      isActionRunning = false;
    }
  });
};

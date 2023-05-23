import {jobCollector} from './jobCollector';
import {filterKeyword} from './filterKeywords';
import {checkAndSaveJobs} from './saveJobs';
import TelegramBot from 'node-telegram-bot-api';

export const scraper = async (
  locations: string[],
  keyword: string,
  isCheckDescription?: boolean,
  bot?: TelegramBot,
  chatId?: number,
) => {
  try {
    const jobs = (await jobCollector(locations, keyword)) ?? [];
    const filteredJobs = isCheckDescription ? await filterKeyword(jobs) : jobs;
    await checkAndSaveJobs(filteredJobs, bot, chatId);
  } catch (err) {
    console.log(err);
  } finally {
    console.log('job done!');
  }
};

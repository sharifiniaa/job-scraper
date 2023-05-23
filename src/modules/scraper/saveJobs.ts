import {TJob} from 'types';
import {parsPath} from './parsPath';
import prisma from '../db';
import {sendJobToChannel} from '../telegram';
import {cleanedText} from '../../helper/cleanedText';
import TelegramBot from 'node-telegram-bot-api';

export async function checkAndSaveJobs(jobs: TJob[], bot?: TelegramBot, chatId?: number) {
  let count = 0;
  try {
    for (const job of jobs) {
      const job_name: string = parsPath(job?.link);
      const existingJob = await prisma.job.findUnique({
        where: {
          job_name: job_name,
        },
      });

      if (!existingJob) {
        count += 1;
        const response = await prisma.job.create({
          data: {
            title: job.title,
            company: job.company,
            location: job.location,
            time: job.time,
            link: job.link,
            description: cleanedText(job.description as string),
            job_name: job_name,
          },
        });
        await sendJobToChannel(response, count, jobs.length);
        console.log('Jobs saved to database successfully!', `${count}/${jobs.length}`);
      }
    }
  } catch (e: any) {
    console.error(`Error saving jobs to database: ${e.message}`);
  } finally {
    if(bot && chatId) {
      bot.sendMessage(chatId, `${jobs.length} jobs found by scraping 😈`);
      bot.sendMessage(chatId, `${count} jobs are new 😬`);
    }
    await prisma.$disconnect();
  }
}

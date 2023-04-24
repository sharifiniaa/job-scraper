import {TJob} from 'types';
import {parsPath} from './parsPath';
import prisma from '../db';
import {sendJobToChannel} from '../telegram';
import {cleanedText} from '../../helper/cleanedText';

export async function checkAndSaveJobs(jobs: TJob[]) {
  let count = 0;
  try {
    for (const job of jobs) {
      const job_name: string = parsPath(job?.link);
      const existingJob = await prisma.job.findUnique({
        where: {
          job_name,
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
    console.log(jobs.length, 'jobs found');
    console.log('new items', count);
    await prisma.$disconnect();
  }
}

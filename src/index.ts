require('dotenv').config();
import {elementGetter} from './modules/scraper/elements';
import {createDriver} from './modules/driver';
import {By, until} from 'selenium-webdriver';
import prisma from './modules/db';
import {TJob} from './types';
import {parsPath} from './modules/scraper/parsPath';

export const scraper = async (location: string) => {
  const driver = await createDriver();

  try {
    await driver.get(
      `https://www.linkedin.com/jobs/search?keywords=React&location=${location}&f_TPR=r86400&geoId=&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0`,
    );

    // for (let i = 0; i < 4; i++) {
    //   // Scroll to the bottom of the page
    //   await driver.executeScript('window.scrollTo(0, document.body.scrollHeight);');

    //   // Wait for new content to load
    //   await driver.wait(until.elementLocated(By.css('ul.jobs-search__results-list>li')));

    //   // Wait for some additional time to allow the page to fully render
    //   await driver.sleep(5000);
    // }

    // Get job listings
    console.log('before listing');
    const jobElements = await driver.findElements(By.css('ul.jobs-search__results-list>li'));
    const jobs: TJob[] = [];
    for (const el of jobElements) {
      const title = await elementGetter({el, selector: 'h3.base-search-card__title'});
      const company = await elementGetter({
        el,
        selector: '[data-tracking-control-name="public_jobs_jserp-result_job-search-card-subtitle"]',
      });
      const location = await elementGetter({el, selector: 'span.job-search-card__location'});
      const time = await elementGetter({el, selector: 'time'});
      const link = await elementGetter({el, selector: 'a.base-card__full-link', method: 'attribute', attr: 'href'});
      const visa = !!title?.includes('visa sponsorship');
      jobs.push({title, company, location, time, link, visa});
    }
    const filteredJobs = await filterJobs(jobs);
    await checkAndSaveJobs(filteredJobs);
  } catch (err) {
    console.log(err);
  } finally {
    // Close the browser
    await driver.quit();
  }
};

async function filterJobs(jobs: TJob[]): Promise<TJob[]> {
  const driver = await createDriver();
  try {
    const filteredJobs: TJob[] = [];
    for (const job of jobs) {
      console.log('finding keywords ...');
      await driver.get(job.link);
      const showMoreBtn = await driver.findElement(By.className('show-more-less-html__button--more'));
      await showMoreBtn.click();
      await driver.sleep(3000);
      const element = await driver.findElement(By.className('core-section-container'));
      const text = await element.getText();
      await driver.sleep(1000);
      job.visa = text.toLocaleLowerCase().includes('visa sponsorship');
      filteredJobs.push(job);
      const handles = await driver.getAllWindowHandles();
      for (let i = 1; i < handles.length; i++) {
        await driver.switchTo().window(handles[i]);
        await driver.close();
      }
      await driver.switchTo().window(handles[0]);
    }
    return filteredJobs;
  } catch (err) {
    console.log(err);
    await driver.quit();
    throw new Error('filtered broken');
  } finally {
    await driver.quit();
  }
}


async function checkAndSaveJobs(jobs: TJob[]) {
  let count = 0;
  try {
    await Promise.all(
      jobs.map(async job => {
        const job_name: string = parsPath(job.link);
        const existingJob = await prisma.job.findUnique({
          where: {
            job_name,
          },
        });

        if (!existingJob) {
          console.log('its unique:', job.title, job.link);
          count = count + 1;
          await prisma.job.create({
            data: {
              title: job.title,
              company: job.company,
              location: job.location,
              time: job.time,
              link: job.link,
              job_name: job_name,
            },
          });
        }
      }),
    );

    console.log('Jobs saved to database successfully!');
  } catch (e: any) {
    console.error(`Error saving jobs to database: ${e.message}`);
  } finally {
    console.log(jobs.length, 'jobs found');
    console.log('new items', count);
    await prisma.$disconnect();
  }
}

scraper('United kingdom');

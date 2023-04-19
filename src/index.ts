require('dotenv').config();
import {elementGetter} from './modules/scraper/elements';
import {createDriver} from './modules/driver';
import {By, until} from 'selenium-webdriver';
import {TJob} from './types';
import {filterKeyword} from 'modules/scraper/filterKeywords';
import {checkAndSaveJobs} from 'modules/scraper/saveJobs';
import { isExcludedByTitle } from 'modules/scraper/isExcludedByTitle';

export const scraper = async (location: string) => {
  const driver = await createDriver();

  try {
    await driver.get(
      `https://www.linkedin.com/jobs/search?keywords=React&location=${location}&f_TPR=r86400&geoId=&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0`,
    );

    for (let i = 0; i < 4; i++) {
      // Scroll to the bottom of the page
      await driver.executeScript('window.scrollTo(0, document.body.scrollHeight);');

      // Wait for new content to load
      await driver.wait(until.elementLocated(By.css('ul.jobs-search__results-list>li')));

      // Wait for some additional time to allow the page to fully render
      await driver.sleep(5000);
    }

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
      if(!isExcludedByTitle(title)) {
        jobs.push({title, company, location, time, link, visa: false});
      }
    }
    const filteredJobs = await filterKeyword(jobs);
    await checkAndSaveJobs(filteredJobs);
  } catch (err) {
    console.log(err);
  } finally {
    // Close the browser
    await driver.quit();
  }
};


scraper('United kingdom');

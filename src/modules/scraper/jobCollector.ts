import {By, until} from 'selenium-webdriver';
import {createDriver} from '../driver';
import {elementGetter} from './elements';
import {isExcludedByTitle} from './isExcludedByTitle';
import {TJob} from '../../types';

export async function jobCollector(locations: string[], keyword: string) {
  const driver = await createDriver();
  const jobs: TJob[] = [];
  try {
    for (const location of locations) {
      const keywords = encodeURI(keyword);
      await driver.get(
        `https://www.linkedin.com/jobs/search?keywords=${keywords}&location=${location}&f_TPR=r86400&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0`,
      );
      /* 
        **FOR Getting All Job Element**
        const jobCount = await driver.findElement(By.className('results-context-header__job-count'))?.getText();
        Math.ceil(+jobCount)
        with Select on Show More Button!
      */
      for (let i = 0; i < 4; i++) {
        // Scroll to the bottom of the page
        await driver.executeScript('window.scrollTo(0, document.body.scrollHeight);');

        // Wait for new content to load
        await driver.wait(until.elementLocated(By.css('ul.jobs-search__results-list>li')));

        // Wait for some additional time to allow the page to fully render
        await driver.sleep(3000);
      }

      // Get job listings
      console.log('before listing...');
      const jobElements = await driver.findElements(By.css('ul.jobs-search__results-list>li'));
      console.log(jobElements.length, `count of jobs for ${location}`);
      for (const el of jobElements) {
        const title = await elementGetter({el, selector: 'h3.base-search-card__title'});
        const company = await elementGetter({
          el,
          selector: '[data-tracking-control-name="public_jobs_jserp-result_job-search-card-subtitle"]',
        });
        const location = await elementGetter({el, selector: 'span.job-search-card__location'});
        const time = await elementGetter({el, selector: 'time'});
        const link = await elementGetter({el, selector: 'a.base-card__full-link', method: 'attribute', attr: 'href'});
        if (isExcludedByTitle(title.toLocaleLowerCase()) && link.length > 1) {
          jobs.push({
            title: title.toLocaleLowerCase(),
            company,
            location,
            time,
            link,
            visa: false,
            description: '',
            source: 'Linkedin',
          });
        } else {
          console.log('filtered by title:', title);
        }
      }
    }
    return jobs;
  } catch (err) {
    console.log(err);
  } finally {
    // Close the browser
    await driver?.quit();
  }
}

const fs = require('fs');
import {elementGetter} from './modules/scrapper/elements';
import {createDriver} from './modules/driver';
import {By, until} from 'selenium-webdriver';

const crawler = async (location: string) => {
  const driver = await createDriver();

  try {
    await driver.get(
      `https://www.linkedin.com/jobs/search?keywords=React&location=${location}&f_TPR=r86400&geoId=&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0`,
    );

    for (let i = 0; i < 3; i++) {
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
    const jobs = [];
    for (const el of jobElements) {
      const title = await elementGetter({el, selector: 'h3.base-search-card__title'});
      const company = await elementGetter({
        el,
        selector: '[data-tracking-control-name="public_jobs_jserp-result_job-search-card-subtitle"]',
      });
      const location = await elementGetter({el, selector: 'span.job-search-card__location'});
      const time = await elementGetter({el, selector: 'time'});
      const link = await elementGetter({el, selector: 'a.base-card__full-link', method: 'attribute', attr: 'href'});

      jobs.push({title, company, location, time, link});
    }

    console.log(jobs);

    // Save results to file
    fs.writeFile('results.txt', JSON.stringify(jobs), (err: never) => {
      if (err) throw err;
      console.log('Results saved to results.txt!');
    });

    console.log(jobs);
  } catch (err) {
    console.log(err);
  } finally {
    // Close the browser
    // await driver.quit();
  }
};

void crawler('United Kingdom');

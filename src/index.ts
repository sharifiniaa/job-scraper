import {Builder, By, until} from 'selenium-webdriver';
// const firefox = require('selenium-webdriver/firefox');
import firefox from 'selenium-webdriver/firefox';
const fs = require('fs');

const crawler = async (location: string) => {
  // Set up Firefox driver
  const options = new firefox.Options();
  options.headless()
  // options.hedless();

  options.setBinary('/Applications/Firefox.app/Contents/MacOS/firefox');
  const driver = await new Builder().forBrowser('firefox').setFirefoxOptions(options).build();

  try {
    await driver.get(
      `https://www.linkedin.com/jobs/search?keywords=React&location=${location}&geoId=&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0`,
    );

    // Get job listings
    console.log('before listing');
    const jobElements = await driver.findElements(By.css('ul.jobs-search__results-list>li'));
    const jobs = [];
    for (const el of jobElements) {
      const title = await el?.findElement(By.css('h3.base-search-card__title'))?.getText();
      const company =
        (await el
          ?.findElement(By.css('[data-tracking-control-name="public_jobs_jserp-result_job-search-card-subtitle"]'))
          ?.getText()) ?? '-';
      const location = (await el?.findElement(By.css('span.job-search-card__location'))?.getText()) ?? '-';
      const time = await el?.findElement(By.css('time.job-search-card__listdate'))?.getText();
    
      // Wait for the anchor element to be clickable before clicking on it
      const link = await el.findElement(By.css('a.base-card__full-link'))?.getAttribute('href');
    
      jobs.push({ title, company, location, time, link });
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
    await driver.quit();
  }
};

void crawler('United Kingdom');

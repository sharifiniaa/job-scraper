require('dotenv').config();
const {Builder, By, Key, until} = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const fs = require('fs');

const crawler = async (location: string) => {
    // Set up Firefox driver
    const options = new firefox.Options();
    // options.hedless();

    options.setBinary('/Applications/Firefox.app/Contents/MacOS/firefox');
    const driver = await new Builder().forBrowser('firefox').setFirefoxOptions(options).build();

    try {
        // Go to LinkedIn login page
        await driver.get('https://www.linkedin.com/login', {});

        // Login to LinkedIn
        await driver.findElement(By.id('username')).sendKeys(process.env.LINKEDIN_USERNAME, Key.RETURN);
        await driver.findElement(By.id('password')).sendKeys(process.env.LINKEDIN_PASSWORD, Key.RETURN);

        // Wait for login to complete and go to job search page
        await driver.wait(until.urlContains('https://www.linkedin.com/feed/'), 30000);
        console.log('there man')
        // f_TPR is a date filter => default: past 24 hour
        await driver.get(`https://www.linkedin.com/jobs/search/?geoId=102029343&keywords=react&location=${location}&f_TPR=r86400`);



        // Get job listings
        console.log('before listing')
        const jobElements = await driver.findElements(By.css('.jobs-search-results__list-item'));
        const jobsElementSlice = jobElements.slice(0, 1)
        console.log('there')
        const jobs = await Promise.all(jobsElementSlice.map(async (el: any) => {
            console.log('iterate by ali')
            const title = await el?.findElement(By.css('.job-card-list__title'))?.getText() ?? 'coudnt find';
            const company = await el?.findElement(By.css('span.job-card-container__primary-description'))?.getText() ?? 'couldn find';
            // const workplaceType = await el?.findElement(By.css('li.job-card-container__metadata-item--workplace-type'))?.getText() ?? 'coudnt find';
            const location = await el?.findElement(By.css('li.job-card-container__metadata-item'))?.getText() ?? 'coudnt find';
            // const link = await el.findElement(By.css('a')).getAttribute('href');
            return {title, company, location};
        }));

        console.log(jobs)

        // Save results to file
        fs.writeFile('results.txt', JSON.stringify(jobs), (err: never) => {
            if (err) throw err;
            console.log('Results saved to results.txt!');
        });

        console.log(jobs);
    } catch (err) {
        console.log(err)
    }
    finally {
        // Close the browser
        await driver.quit();
    }
};

void crawler('Amsterdam');

require('dotenv').config();
import {filterKeyword} from './modules/scraper/filterKeywords';
import {checkAndSaveJobs} from './modules/scraper/saveJobs';
import {jobCollector} from './modules/scraper/jobCollector';
import {collectCompanies} from './modules/companies';
import {cli} from './modules/cli';

export const scraper = async (locations: string[], keyword: string, isCheckDescription: boolean) => {
  try {
    const jobs = (await jobCollector(locations, keyword)) ?? [];
    const filteredJobs = isCheckDescription ? await filterKeyword(jobs) : jobs;
    await checkAndSaveJobs(filteredJobs);
  } catch (err) {
    console.log(err);
  } finally {
    console.log('job done!');
  }
};

export async function runScripts() {
  const userArgs = await cli();
  if (userArgs) {
    await collectCompanies();
    console.log(userArgs);
    await scraper(userArgs.locations, userArgs.keyword, userArgs.d);
  }
}

void runScripts();

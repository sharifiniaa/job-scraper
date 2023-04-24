require('dotenv').config();
import {filterKeyword} from './modules/scraper/filterKeywords';
import {checkAndSaveJobs} from './modules/scraper/saveJobs';
import {jobCollector} from './modules/scraper/jobCollector';
import {collectCompanies} from './modules/companies';

export const scraper = async (locations: string[], keyword: string) => {
  try {
    const jobs = (await jobCollector(locations, keyword)) ?? [];
    const filteredJobs = await filterKeyword(jobs);
    await checkAndSaveJobs(filteredJobs);
  } catch (err) {
    console.log(err);
  } finally {
    console.log('job done!');
  }
};

async function runScripts() {
  await collectCompanies();
  await scraper(['Netherlands', 'Sweden'], 'frontend');
}

void runScripts();

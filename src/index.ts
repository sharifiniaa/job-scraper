require('dotenv').config();
import {scraper} from './modules/scraper';
import {collectCompanies} from './modules/companies';
import {cli} from './modules/cli';

export async function runScripts() {
  const userArgs = await cli();
  if (userArgs) {
    await collectCompanies();
    await scraper(userArgs.locations, userArgs.keyword, userArgs.d);
  }
}

void runScripts();

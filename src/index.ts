require('dotenv').config();
import {scraper} from './modules/scraper';
import {collectCompanies} from './modules/companies';
import {cli} from './modules/cli';
import {generateCoverLetter, getUserInformation, startScarpData} from './modules/telegram';

generateCoverLetter();
getUserInformation();
startScarpData();

export async function runScripts() {
  const userArgs = await cli();
  if (userArgs) {
    await collectCompanies();
    console.log(userArgs);
    await scraper(userArgs.locations, userArgs.keyword, userArgs.d);
  }
}

void runScripts();

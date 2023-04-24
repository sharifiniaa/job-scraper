import {Builder} from 'selenium-webdriver';
import firefox from 'selenium-webdriver/firefox';

export async function createDriver() {
  const options = new firefox.Options();
  // options.headless()
  // options.setBinary('/Applications/Firefox.app/Contents/MacOS/firefox');
  return new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
}

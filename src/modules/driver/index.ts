import {Builder} from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

export async function createDriver() {
  const options = new chrome.Options();
  options.headless()
  return new Builder().forBrowser('chrome').setChromeOptions(options).build();
}

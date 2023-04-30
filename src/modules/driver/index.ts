import {Builder} from 'selenium-webdriver';
import firefox from 'selenium-webdriver/firefox';

export async function createDriver() {
  const options = new firefox.Options();
  // options.headless()
  return new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
}

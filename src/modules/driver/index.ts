import {Builder} from 'selenium-webdriver';
import firefox from 'selenium-webdriver/firefox';

export async function createDriver() {
  const options = new firefox.Options();
  // options.headless();
  options.addArguments('--ignore-ssl-errors=yes');
  options.addArguments('--ignore-certificate-errors');
  return new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
}

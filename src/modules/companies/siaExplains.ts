import prisma from '../db';
import {createDriver} from '../driver';
import {By} from 'selenium-webdriver';

export const siaExplains = async () => {
  const driver = await createDriver();

  try {
    await driver.get('https://siaexplains.github.io/visa-sponsorship-companies/');
    await driver.sleep(3000);
    const parentElement = await driver.findElements(By.className('odd:bg-white'));
    const companies: string[] = [];
    for (const element of parentElement) {
      const childElement = await element.findElement(By.css('td:first-child'));
      const company = await childElement.getText();
      companies.push(company.toLocaleLowerCase());
    }
    let newCompanies = 0;
    for (const el of companies) {
      const isExist = await prisma.companies.findUnique({
        where: {
          name: el,
        },
      });
      if (!isExist) {
        newCompanies = newCompanies + 1;
        await prisma.companies.create({data: {name: el, source: 'siaexplains'}});
      }
    }
    return {newCompanies, companies: companies.length};
  } catch (err) {
    console.log(err);
  } finally {
    await driver.quit();
  }
};

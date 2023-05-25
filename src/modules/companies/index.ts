import prisma from '../db';
import {createDriver} from '../driver';
import {By} from 'selenium-webdriver';

export async function collectCompanies() {
  const driver = await createDriver();

  try {
    await driver.get('https://relocate.me/companies');
    await driver.sleep(3000);
    const parentElement = await driver.findElements(By.className('wwbc-companies__link'));
    const companies: string[] = [];
    for (const element of parentElement) {
      const childElement = await element.findElement(By.css('span:first-child'));
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
        await prisma.companies.create({data: {name: el}});
      }
    }
    return {newCompanies, companies};
  } catch (err) {
    console.log(err);
  } finally {
    await driver.quit();
  }
}

import {TJob} from 'types';
import {createDriver} from '../driver';
import {By} from 'selenium-webdriver';
import prisma from '../db';

export async function filterKeyword(jobs: TJob[]): Promise<TJob[]> {
  const driver = await createDriver();
  try {
    const filteredJobs: TJob[] = [];
    for (const job of jobs) {
      console.log('finding keywords ...');
      await driver.get(job.link);
      const showMoreBtn = await driver.findElement(By.className('show-more-less-html__button--more'));
      await showMoreBtn.click();
      await driver.sleep(3000);
      const element = await driver.findElement(By.className('core-section-container'));
      const text = await element.getText();
      await driver.sleep(1000);
      const companyName = text.toLocaleLowerCase();
      const haveVisa =
        (await prisma.companies.findUnique({where: {name: companyName}})) ||
        text.toLocaleLowerCase().includes('visa sponsorship');
      job.visa = !!haveVisa;
      filteredJobs.push(job);
      const handles = await driver.getAllWindowHandles();
      for (let i = 1; i < handles.length; i++) {
        await driver.switchTo().window(handles[i]);
        await driver.close();
      }
      await driver.switchTo().window(handles[0]);
    }
    return filteredJobs;
  } catch (err) {
    console.log(err);
    await driver.quit();
    throw new Error('filtered broken');
  } finally {
    await driver.quit();
  }
}

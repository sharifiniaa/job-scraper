import {cleanedText} from '../../helper/cleanedText';
import {createDriver} from '../driver';
import {jobDescriptionClicker} from './elements';
import {By} from 'selenium-webdriver';
import prisma from '../db';

export async function getDescription(id: number) {
  try {
    const job = await prisma.job.findUnique({
      where: {
        id,
      },
    });
    if (!job) {
      console.log(`Job ${id} is not exist in db`);
      return null;
    }
    if (job.description) {
      return job.description;
    }
    const description = await scrapDescription(job.link);

    const updatedJob = await prisma.job.update({
      where: {id},
      data: {
        description,
      },
    });
    return updatedJob?.description;
  } catch (err) {
    console.log(err);
  }
}

export async function scrapDescription(link: string) {
  const driver = await createDriver();
  try {
    await driver.get(link);
    await jobDescriptionClicker(driver);
    await driver.sleep(5000);
    const element = await driver.findElement(By.className('core-section-container'));
    const text = await element.getText();
    const editedText = cleanedText(text).substring(0, 1000);
    return editedText;
  } catch (err) {
    console.log(err);
  } finally {
    driver?.quit();
  }
}

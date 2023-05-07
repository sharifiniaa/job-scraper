import {By, WebDriver, WebElement} from 'selenium-webdriver';

type TElementGetter = {
  el: WebElement;
  selector: string;
  method?: 'text' | 'attribute';
  attr?: string;
};

export async function elementGetter({el, selector, method = 'text', attr = 'href'}: TElementGetter) {
  let name = '';
  try {
    const element = await el.findElement(By.css(selector));
    name = method == 'text' ? await element.getText() : await element.getAttribute(attr);
  } catch {
    name = '';
  } finally {
    return name;
  }
}


export async function jobDescriptionClicker(el: WebDriver) {
  try {
    const showMoreBtn = await el.findElement(By.className('show-more-less-html__button--more'));
    await showMoreBtn?.click();
  }
  catch (err){
    console.log("element didn't had description", err)
  }
}

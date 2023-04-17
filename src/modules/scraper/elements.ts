import {By, WebElement} from 'selenium-webdriver';

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

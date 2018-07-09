import { browser, by, element } from 'protractor';

export class LilBloggerA4AppPage {
  navigateTo() {
    return browser.get('/articles');
  }

  async getNavbarHeaderText() {

    await new Promise(resolve => setTimeout(() => {
      resolve();
    }, 10000));
    const el = element(by.css('app-root a.navbar-brand'));

    try {
      const text = await el.getText();
      return text;
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }
}

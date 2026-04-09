import Browser from '../lib/browser/browser.js';
import { writeToData } from '../utils/misc.js';
import { cleanUrl } from '../utils/string.js';

class AirBnbCrawler {
  private browser;

  constructor() {
    this.browser = Browser.getInstance();
  }

  async getHtmlPage(url: string) {
    return this.browser.queueTask(async () => {
      const page = await this.browser.newInjectedPage();

      // goto
      this.browser.logHeaders(page);
      await page.goto(url, { waitUntil: 'load' });
      const html = await page.content();

      // store screenshot + html
      const title = cleanUrl(url);
      await this.browser.screenshot(page, title);
      writeToData('html', `${title}.html`, html);

      return html;
    });
  }
}

const airBnbCrawler = new AirBnbCrawler();

export { AirBnbCrawler, airBnbCrawler };

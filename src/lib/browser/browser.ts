import { newInjectedPage } from 'fingerprint-injector';
import { mkdirSync } from 'fs';
import { join } from 'path';
import puppeteer, {
  Browser as PuppeteerBrowser,
  Page,
  BrowserContext,
  LaunchOptions,
  GoToOptions,
} from 'puppeteer';

type Task<T> = () => Promise<T>;

class Browser {
  private static instance: Browser;
  private browser: PuppeteerBrowser | null = null;

  private queue: Task<any>[] = [];
  private activeCount = 0;
  private maxConcurrency = 3;

  private constructor() {}

  setMaxConcurrency(n: number) {
    this.maxConcurrency = n;
  }

  static getInstance(): Browser {
    if (!Browser.instance) Browser.instance = new Browser();
    return Browser.instance;
  }

  async launch(options?: LaunchOptions): Promise<PuppeteerBrowser> {
    if (!this.browser)
      this.browser = await puppeteer.launch({
        headless: true,
        ...options,
      });
    return this.browser;
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async newPage(): Promise<Page> {
    if (!this.browser) await this.launch();
    return this.browser!.newPage();
  }

  async newInjectedPage(): Promise<Page> {
    if (!this.browser) await this.launch();
    const page = await newInjectedPage(this.browser!, {
      fingerprintOptions: {
        devices: ['desktop'],
        operatingSystems: ['linux', 'windows'],
        locales: ['en', 'en-ID', 'en-MY', 'en-SG'],
      },
    });
    await page.setViewport({ width: 1920, height: 1080 });
    return page;
  }

  async newContext(): Promise<BrowserContext> {
    if (!this.browser) await this.launch();
    return this.browser!.createBrowserContext();
  }

  async withPage<T>(fn: (page: Page) => Promise<T>): Promise<T> {
    const page = await this.newPage();
    try {
      return await fn(page);
    } finally {
      await page.close();
    }
  }

  async goto(
    page: Page,
    url: string,
    options: GoToOptions = { waitUntil: 'networkidle2' }
  ): Promise<void> {
    await page.goto(url, options);
  }

  async blockResources(page: Page, types: string[] = ['image', 'font']) {
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (types.includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });
  }

  async screenshot(page: Page, title: string) {
    const dir = join(process.cwd(), 'data', 'screenshots');
    mkdirSync(dir, { recursive: true });

    const path = join(dir, `${Date.now()}-${title}.png`);
    await page.screenshot({ path, fullPage: true });
  }

  async html(page: Page): Promise<string> {
    return page.content();
  }

  logHeaders(page: Page) {
    page.once('request', (req) => {
      if (req.isNavigationRequest()) {
        console.log('\n🔗 URL:', req.url());

        const headers = req.headers();
        Object.keys(headers)
          .sort()
          .forEach((k) => console.log(`- ${k}: ${headers[k]}`));
      }
    });
  }

  async queueTask<T>(task: Task<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (err) {
          reject(err);
        }
      });
      this.runNext();
    });
  }

  private async runNext() {
    if (this.activeCount >= this.maxConcurrency) return;
    const task = this.queue.shift();
    if (!task) return;

    this.activeCount++;
    try {
      await task();
    } finally {
      this.activeCount--;
      this.runNext();
    }
  }
}

export default Browser;

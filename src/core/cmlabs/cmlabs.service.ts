import { cmLabsCrawler } from '../../crawlers/cmlabs.crawler.js';
import { GetCMLabsWebPage } from './cmlabs.schema.js';

class CMLabsService {
  getWebPage = async (payload: GetCMLabsWebPage) => {
    const html = await cmLabsCrawler.getHtmlPage(payload.url);
    return html;
  };
}

const cmLabsService = new CMLabsService();
export { CMLabsService, cmLabsService };

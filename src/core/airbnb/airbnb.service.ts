import { airBnbCrawler } from '../../crawlers/airbnb.crawler.js';
import { GetAirBnbWebPage } from './airbnb.schema.js';

class AirBnbService {
  getWebPage = async (payload: GetAirBnbWebPage) => {
    const html = await airBnbCrawler.getHtmlPage(payload.url);
    return html;
  };
}

const airBnbService = new AirBnbService();
export { AirBnbService, airBnbService };

import { sequenceDayCrawler } from '../../crawlers/sequenceday.crawler.js';
import { GetSequenceDayWebPage } from './sequenceday.schema.js';

class SequenceDayService {
  getWebPage = async (payload: GetSequenceDayWebPage) => {
    const html = await sequenceDayCrawler.getHtmlPage(payload.url);
    return html;
  };
}

const sequenceDayService = new SequenceDayService();
export { SequenceDayService, sequenceDayService };

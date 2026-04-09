import type { Request, Response } from 'express';
import {
  sequenceDayService,
  SequenceDayService,
} from './sequenceday.service.js';
import BaseController from '../../base/controller.base.js';
import { GetSequenceDayWebPage } from './sequenceday.schema.js';

class SequenceDayController extends BaseController {
  private service: SequenceDayService;

  constructor() {
    super();
    this.service = sequenceDayService;
  }

  getWebPage = async (
    req: Request<{}, {}, {}, GetSequenceDayWebPage>,
    res: Response
  ) => {
    const data = await this.service.getWebPage(req._query);
    return this.html(res, data);
  };
}

const sequenceDayController = new SequenceDayController();
export { sequenceDayController, SequenceDayController };

import type { Request, Response } from 'express';
import { cmLabsService, CMLabsService } from './cmlabs.service.js';
import BaseController from '../../base/controller.base.js';
import { GetCMLabsWebPage } from './cmlabs.schema.js';

class CMLabsController extends BaseController {
  private service: CMLabsService;

  constructor() {
    super();
    this.service = cmLabsService;
  }

  getWebPage = async (
    req: Request<{}, {}, {}, GetCMLabsWebPage>,
    res: Response
  ) => {
    const data = await this.service.getWebPage(req._query);
    return this.html(res, data);
  };
}

const cmLabsController = new CMLabsController();
export { cmLabsController, CMLabsController };

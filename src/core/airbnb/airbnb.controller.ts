import type { Request, Response } from 'express';
import { airBnbService, AirBnbService } from './airbnb.service.js';
import BaseController from '../../base/controller.base.js';
import { GetAirBnbWebPage } from './airbnb.schema.js';

class AirBnbController extends BaseController {
  private service: AirBnbService;

  constructor() {
    super();
    this.service = airBnbService;
  }

  getWebPage = async (
    req: Request<{}, {}, {}, GetAirBnbWebPage>,
    res: Response
  ) => {
    const data = await this.service.getWebPage(req._query);
    return this.html(res, data);
  };
}

const airBnbController = new AirBnbController();
export { airBnbController, AirBnbController };

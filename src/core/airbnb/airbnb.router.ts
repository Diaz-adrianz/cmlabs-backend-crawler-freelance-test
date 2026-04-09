import { Router } from 'express';
import { validate } from '../../middlewares/validator.middleware.js';
import { airBnbController } from './airbnb.controller.js';
import { getAirBnbWebPageSchema } from './airbnb.schema.js';

const r = Router(),
  controller = airBnbController;

r.get(
  '/get-webpage',
  validate({ query: getAirBnbWebPageSchema }),
  controller.getWebPage
);

const airBnbRouter = r;
export default airBnbRouter;

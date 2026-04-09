import { Router } from 'express';
import { validate } from '../../middlewares/validator.middleware.js';
import { sequenceDayController } from './sequenceday.controller.js';
import { getSequenceDayWebPageSchema } from './sequenceday.schema.js';

const r = Router(),
  controller = sequenceDayController;

r.get(
  '/get-webpage',
  validate({ query: getSequenceDayWebPageSchema }),
  controller.getWebPage
);

const sequenceDayRouter = r;
export default sequenceDayRouter;

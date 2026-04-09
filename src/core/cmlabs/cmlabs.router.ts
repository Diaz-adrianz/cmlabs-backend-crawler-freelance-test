import { Router } from 'express';
import { validate } from '../../middlewares/validator.middleware.js';
import { cmLabsController } from './cmlabs.controller.js';
import { getCMLabsWebPageSchema } from './cmlabs.schema.js';

const r = Router(),
  controller = cmLabsController;

r.get(
  '/get-webpage',
  validate({ query: getCMLabsWebPageSchema }),
  controller.getWebPage
);

const cmlabsRouter = r;
export default cmlabsRouter;

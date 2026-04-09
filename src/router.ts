import { Router } from 'express';
import cmlabsRouter from './core/cmlabs/cmlabs.router.js';
import sequenceDayRouter from './core/sequenceday/sequenceday.router.js';

const r = Router();

r.use('/cmlabs', cmlabsRouter);
r.use('/sequenceday', sequenceDayRouter);

const router = r;
export default router;

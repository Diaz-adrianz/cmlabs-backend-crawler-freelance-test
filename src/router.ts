import { Router } from 'express';
import cmlabsRouter from './core/cmlabs/cmlabs.router.js';

const r = Router();

r.use('/cmlabs', cmlabsRouter);

const router = r;
export default router;

import { Router } from 'express';
import { menuRouter } from './menu.routes';
import { orderRouter } from './order.routes';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

apiRouter.use('/menu', menuRouter);
apiRouter.use('/orders', orderRouter);

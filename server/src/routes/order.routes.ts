import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { asyncHandler } from '../middleware/async-handler';
import { createOrderRateLimiter } from '../middleware/rate-limiters';

const orderController = new OrderController();

export const orderRouter = Router();

orderRouter.post('/', createOrderRateLimiter, asyncHandler(orderController.createOrder));
orderRouter.get('/:id', asyncHandler(orderController.getOrderById));
orderRouter.patch('/:id/status', asyncHandler(orderController.updateOrderStatus));

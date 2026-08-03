import { Request, Response } from 'express';
import {
  createOrderSchema,
  orderIdParamsSchema,
  updateOrderStatusSchema
} from '../schemas/order.schema';
import { OrderService } from '../services/order.service';

export class OrderController {
  constructor(private readonly orderService = new OrderService()) {}

  createOrder = async (req: Request, res: Response) => {
    const payload = createOrderSchema.parse(req.body);
    const order = await this.orderService.createOrder(payload);

    res.status(201).json({
      data: order
    });
  };

  getOrderById = async (req: Request, res: Response) => {
    const { id } = orderIdParamsSchema.parse(req.params);
    const order = await this.orderService.getOrderById(id);

    res.status(200).json({
      data: order
    });
  };

  updateOrderStatus = async (req: Request, res: Response) => {
    const { id } = orderIdParamsSchema.parse(req.params);
    const { status } = updateOrderStatusSchema.parse(req.body);
    const order = await this.orderService.updateOrderStatus(id, status);

    res.status(200).json({
      data: order
    });
  };
}

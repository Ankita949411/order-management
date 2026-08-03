import { Router } from 'express';
import { MenuController } from '../controllers/menu.controller';
import { asyncHandler } from '../middleware/async-handler';

const menuController = new MenuController();

export const menuRouter = Router();

menuRouter.get('/', asyncHandler(menuController.getMenu));

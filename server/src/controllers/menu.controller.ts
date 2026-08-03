import { Request, Response } from 'express';
import { MenuService } from '../services/menu.service';

export class MenuController {
  constructor(private readonly menuService = new MenuService()) {}

  getMenu = async (_req: Request, res: Response) => {
    const menu = await this.menuService.getAvailableMenu();

    res.status(200).json({
      data: menu
    });
  };
}

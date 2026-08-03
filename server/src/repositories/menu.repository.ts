import { PrismaClient } from '@prisma/client';
import { prisma } from '../config/prisma';
import { MenuRepositoryPort } from './menu.repository.interface';

export class MenuRepository implements MenuRepositoryPort {
  constructor(private readonly db: PrismaClient = prisma) {}

  findAvailable() {
    return this.db.menuItem.findMany({
      where: {
        isAvailable: true
      },
      orderBy: {
        name: 'asc'
      }
    });
  }

  findAvailableByIds(ids: string[]) {
    return this.db.menuItem.findMany({
      where: {
        id: {
          in: ids
        },
        isAvailable: true
      }
    });
  }
}

import { MenuItem } from '@prisma/client';

export interface MenuRepositoryPort {
  findAvailable(): Promise<MenuItem[]>;
  findAvailableByIds(ids: string[]): Promise<MenuItem[]>;
}

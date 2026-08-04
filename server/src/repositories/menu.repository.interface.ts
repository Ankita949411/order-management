export type MenuItemRecord = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export interface MenuRepositoryPort {
  findAvailable(): Promise<MenuItemRecord[]>;
  findAvailableByIds(ids: string[]): Promise<MenuItemRecord[]>;
}

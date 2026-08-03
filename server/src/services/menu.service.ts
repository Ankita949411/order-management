import { MenuRepository } from '../repositories/menu.repository';
import { MenuRepositoryPort } from '../repositories/menu.repository.interface';

export class MenuService {
  constructor(private readonly menuRepository: MenuRepositoryPort = new MenuRepository()) {}

  getAvailableMenu() {
    return this.menuRepository.findAvailable();
  }
}

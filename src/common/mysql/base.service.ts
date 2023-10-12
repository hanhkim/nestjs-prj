import { Repository } from 'typeorm';
import { BaseEntity } from './base.entity';

export class MysqlBaseService<Entity extends BaseEntity> {
  constructor(protected repo: Repository<Entity>) {}

  async save(data: any): Promise<any> {
    const savedUser = await this.repo.save(data as any);
    return savedUser;
  }

  async update(id: string, user: any): Promise<string> {
    const savedUser = await this.repo.update(id, user as any);

    if (!savedUser) return 'updated failed';

    return 'updated successful';
  }

  async findOne(id: string): Promise<any> {
    const user: Entity = await this.repo.findOneBy({
      id: id as any,
    });
    return user;
  }

  async deleteById(id: string): Promise<{ result: string }> {
    const deletedUser = await this.repo.softDelete(id);

    if (!deletedUser) return { result: 'Deleted failed!' };

    return { result: 'Deleted successful!' };
  }
}

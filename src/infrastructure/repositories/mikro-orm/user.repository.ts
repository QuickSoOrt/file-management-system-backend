import { Injectable, NotFoundException } from '@nestjs/common';
import User from '../../entities/mikro-orm/user.entity';
import { EntityRepository } from '@mikro-orm/mongodb';

@Injectable()
export class UserRepository extends EntityRepository<User> {
  async insert(user: User): Promise<void> {
    await this.persist(user);
  }

  async findUsers(): Promise<User[]> {
    return await this.findAll();
  }

  async findByEmail(email: string): Promise<User> {
    return await this.findOne({ email: email });
  }

  async findByUsername(username: string): Promise<User> {
    return await this.findOne({ username: username });
  }

  async findById(id: string): Promise<User> {
    return await this.findOne({ id: id });
  }
}

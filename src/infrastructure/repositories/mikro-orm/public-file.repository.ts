import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/mongodb';
import PublicFile from '../../entities/mikro-orm/public-file';
import User from '../../entities/mikro-orm/user.entity';

@Injectable()
export class PublicFileRepository extends EntityRepository<PublicFile> {
  async insertPublicFile(publicFile: PublicFile): Promise<void> {
    await this.persist(publicFile);
  }

  async findByUser(owner: User): Promise<PublicFile> {
    return await this.findOne({ owner: owner });
  }
}

import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/mongodb';
import FilePermission from '../../entities/mikro-orm/file-permission';
import User from '../../entities/mikro-orm/user.entity';
import File from '../../entities/mikro-orm/file.entity';

@Injectable()
export class FilePermissionRepository extends EntityRepository<FilePermission> {
  async insertPermissions(filePermissions: FilePermission[]): Promise<void> {
    await this.persist(filePermissions);
  }

  async deletePermissions(filePermissions: FilePermission[]): Promise<void> {
    await this.remove(filePermissions);
  }

  async findPermissions(owner: User): Promise<FilePermission[]> {
    return await this.find({ user: owner }, { populate: ['file.folder'] });
  }

  async findByUserAndFile(user: User, file: File): Promise<FilePermission> {
    return await this.findOne({ user: user, file: file });
  }
}

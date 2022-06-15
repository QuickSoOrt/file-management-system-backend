import { Injectable } from '@nestjs/common';
import File from '../../entities/mikro-orm/file.entity';
import { EntityRepository } from '@mikro-orm/mongodb';
import Folder from '../../entities/mikro-orm/folder.entity';
import User from '../../entities/mikro-orm/user.entity';

@Injectable()
export class FileRepository extends EntityRepository<File> {
  async insert(file: File): Promise<void> {
    this.persist(file);
  }

  async findByIdAndOwner(owner: User, id: string): Promise<File> {
    return await this.findOne(
      { owner: owner, id: id },
      { populate: ['owner', 'folder', 'permissions.user'] },
    );
  }

  async findById(id: string): Promise<File> {
    return await this.findOne(
      { id: id },
      { populate: ['owner', 'folder', 'permissions.user'] },
    );
  }

  async findSubFiles(path: string) {
    return await this.find(
      { path: new RegExp(path) },
      { populate: ['owner', 'folder', 'permissions.user'] },
    );
  }

  async findChildreenFiles(owner: User, folder: Folder): Promise<File[]> {
    return await this.find(
      { owner: owner, folder: folder },
      { populate: ['owner', 'folder', 'permissions.user'] },
    );
  }

  async findByName(
    owner: User,
    parentFolder: Folder,
    fileName: string,
  ): Promise<File> {
    return await this.findOne(
      {
        owner: owner,
        folder: parentFolder,
        name: fileName,
      },
      { populate: ['owner', 'folder', 'permissions.user'] },
    );
  }

  async updateFile(file: File): Promise<void> {
    await this.persist(file);
  }

  async delete(file: File): Promise<void> {
    await this.remove(file);
  }
}

import { Injectable } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mongodb';
import Folder from '../../entities/mikro-orm/folder.entity';
import File from '../../entities/mikro-orm/file.entity';
import User from '../../entities/mikro-orm/user.entity';
import FilePermission from '../../entities/mikro-orm/file-permission';
import FolderPermission from '../../entities/mikro-orm/folder-permission';
import PublicFile from '../../entities/mikro-orm/public-file';

@Injectable()
export class UnitOfWork {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {}

  getManager() {
    return this.em;
  }

  getFolderRepository() {
    return this.em.getRepository(Folder);
  }

  getFileRepository() {
    return this.em.getRepository(File);
  }

  getPublicFileRepository() {
    return this.em.getRepository(PublicFile);
  }

  getUserRepository() {
    return this.em.getRepository(User);
  }

  getFilePermissionRepository() {
    return this.em.getRepository(FilePermission);
  }

  getFolderPermissionRepository() {
    return this.em.getRepository(FolderPermission);
  }

  async save() {
    await this.em.flush();
  }
}

import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/mongodb';
import Folder from '../../entities/mikro-orm/folder.entity';
import FolderPermission from '../../entities/mikro-orm/folder-permission';
import User from '../../entities/mikro-orm/user.entity';

@Injectable()
export class FolderPermissionRepository extends EntityRepository<FolderPermission> {
  async insertPermissions(
    folderPermissions: FolderPermission[],
  ): Promise<void> {
    await this.persist(folderPermissions);
  }

  async deletePermissions(
    folderPermissions: FolderPermission[],
  ): Promise<void> {
    await this.remove(folderPermissions);
  }

  async findUserPermissions(owner: User): Promise<FolderPermission[]> {
    return await this.find({ user: owner }, { populate: ['folder.parent', 'folder.permissions.user'] });
  }

  async findFolderPermissions(folder: Folder): Promise<FolderPermission[]> {
    return await this.find({ folder: folder });
  }

  async findByUserAndFolder(
    user: User,
    folder: Folder,
  ): Promise<FolderPermission> {
    return await this.findOne({ user: user, folder: folder });
  }
}

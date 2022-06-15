import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/mongodb';
import Folder from '../../entities/mikro-orm/folder.entity';
import User from '../../entities/mikro-orm/user.entity';
import File from '../../entities/mikro-orm/file.entity';

@Injectable()
export class FolderRepository extends EntityRepository<Folder> {
  async insert(folder: Folder): Promise<void> {
    await this.persist(folder);
  }

  async findByIdAndOwner(owner: User, id: string): Promise<Folder> {
    return await this.findOne(
      { owner: owner, id: id },
      { populate: ['parent', 'permissions.user'] },
    );
  }

  async findById(id: string): Promise<Folder> {
    return await this.findOne(
      { id: id },
      { populate: ['parent', 'permissions.user'] },
    );
  }

  async findFolderAndChildreens(folderId: string): Promise<Folder> {
    return await this.findOne(
      { id: folderId },
      { populate: ['childFolders', 'permissions.user'] },
    );
  }

  async findFoldersAndSubFoldersByPath(path: string) {
    return await this.find(
      { path: new RegExp(path) },
      { populate: ['parent', 'permissions.user'] },
    );
  }

  async findChildreenFolders(owner: User, folder: Folder): Promise<Folder[]> {
    return await this.find(
      { owner: owner, parent: folder },
      { populate: ['parent', 'permissions.user'] },
    );
  }

  async findByName(owner: User, parent: Folder, name: string): Promise<Folder> {
    return await this.findOne(
      {
        owner: owner,
        parent: parent,
        name: name,
      },
      { populate: ['parent', 'permissions.user'] },
    );
  }

  async getFolderPath(id: string): Promise<string> {
    let path = '';
    let folder = null;
    folder = await this.findOne({ id: id }, { populate: ['parent'] });
    while (true) {
      if (folder) {
        path = folder.name + '/' + path;
        folder = folder.parent;
      } else {
        return path;
      }
    }
  }

  async deleteFolder(id: string) {
    const folder = await this.findOne(
      { id: id },
      { populate: ['childFolders', 'childFiles'] },
    );
    if (folder.childFolders.count() != 0) {
      for (const f of folder.childFolders.toArray()) {
        await this.deleteFolder(f.id);
      }
    }
    await this.remove(folder);
  }

  async updateFolder(folder: Folder): Promise<void> {
    await this.persist(folder);
  }
}

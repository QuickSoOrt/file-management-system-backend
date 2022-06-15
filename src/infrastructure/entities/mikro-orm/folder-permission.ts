import { Entity, EntityRepositoryType, Enum, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from './base-entity.entity';
import User from './user.entity';
import Folder from './folder.entity';
import { AccessTypeEnum } from './access-type.enum';
import { FolderPermissionRepository } from '../../repositories/mikro-orm/folder-permission.repository';

@Entity({ customRepository: () => FolderPermissionRepository })
class FolderPermission extends BaseEntity {
  [EntityRepositoryType]?: FolderPermissionRepository;
  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Folder)
  folder!: Folder;

  @Enum(() => AccessTypeEnum)
  accessType!: AccessTypeEnum;
}

export default FolderPermission;

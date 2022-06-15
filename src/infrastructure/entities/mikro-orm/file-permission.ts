import { Entity, EntityRepositoryType, Enum, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from './base-entity.entity';
import User from './user.entity';
import File from './file.entity';
import { AccessTypeEnum } from './access-type.enum';
import { FilePermissionRepository } from '../../repositories/mikro-orm/file-permission.repository';

@Entity({ customRepository: () => FilePermissionRepository })
class FilePermission extends BaseEntity {
  [EntityRepositoryType]?: FilePermissionRepository;
  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => File)
  file!: File;

  @Enum(() => AccessTypeEnum)
  accessType!: AccessTypeEnum;
}

export default FilePermission;

import {
  Cascade,
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from './base-entity.entity';
import { FileRepository } from '../../repositories/mikro-orm/file.repository';
import User from './user.entity';
import Folder from './folder.entity';
import FilePermission from './file-permission';
import { Binary } from 'mongodb';

@Entity({ customRepository: () => FileRepository })
class File extends BaseEntity {
  [EntityRepositoryType]?: FileRepository;

  @Property()
  name!: string;

  @Property()
  systemName!: string;

  @Property()
  path!: string;

  @Property()
  size!: number;

  @Property()
  mimetype!: string;

  @Property()
  IV!: Binary;

  @ManyToOne(() => User)
  owner!: User;

  @ManyToOne(() => Folder, { nullable: true })
  folder!: Folder;

  @OneToMany(() => FilePermission, (filePermission) => filePermission.file, {
    orphanRemoval: true,
    cascade: [Cascade.ALL],
  })
  permissions = new Collection<FilePermission>(this);
}

export default File;

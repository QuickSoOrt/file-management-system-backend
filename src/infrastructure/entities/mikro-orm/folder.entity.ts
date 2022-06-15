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
import User from './user.entity';
import File from './file.entity';
import { FolderRepository } from '../../repositories/mikro-orm/folder.repository';
import FolderPermission from './folder-permission';

@Entity({ customRepository: () => FolderRepository })
class Folder extends BaseEntity {
  [EntityRepositoryType]?: FolderRepository;

  @Property()
  public name!: string;

  @Property()
  systemName!: string;

  @Property()
  public path!: string;

  @ManyToOne(() => Folder, { nullable: true })
  parent!: Folder;

  @OneToMany(() => Folder, (folder) => folder.parent, {
    orphanRemoval: true,
    cascade: [Cascade.ALL],
  })
  childFolders = new Collection<Folder>(this);

  @OneToMany(() => File, (file) => file.folder, {
    orphanRemoval: true,
    cascade: [Cascade.ALL],
  })
  childFiles = new Collection<File>(this);

  @OneToMany(
    () => FolderPermission,
    (folderPermission) => folderPermission.folder,
    {
      orphanRemoval: true,
      cascade: [Cascade.ALL],
    },
  )
  permissions = new Collection<FolderPermission>(this);

  @ManyToOne(() => User)
  owner!: User;
}

export default Folder;

import {
  Collection,
  Entity,
  EntityRepositoryType,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from './base-entity.entity';
import Folder from './folder.entity';
import File from './file.entity';
import { UserRepository } from '../../repositories/mikro-orm/user.repository';
import FolderPermission from './folder-permission';
import FilePermission from './file-permission';
import PublicFile from './public-file';

@Entity({ customRepository: () => UserRepository })
class User extends BaseEntity {
  [EntityRepositoryType]?: UserRepository;

  @Property()
  email!: string;

  @Property({ nullable: true })
  name!: string;

  @Property({ nullable: true })
  username!: string;

  @Property()
  password!: string;

  @OneToOne({ nullable: true })
  publicFile!: PublicFile;

  @OneToMany(() => Folder, (folder) => folder.owner)
  folders = new Collection<Folder>(this);

  @OneToMany(() => File, (file) => file.owner)
  files = new Collection<File>(this);

  @OneToMany(() => FilePermission, (filePermission) => filePermission.user)
  filePermissions = new Collection<FilePermission>(this);

  @OneToMany(
    () => FolderPermission,
    (folderPermission) => folderPermission.user,
  )
  folderPermissions = new Collection<FolderPermission>(this);
}

export default User;

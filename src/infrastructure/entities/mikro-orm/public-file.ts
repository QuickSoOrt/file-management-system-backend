import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from './base-entity.entity';
import User from './user.entity';
import { PublicFileRepository } from '../../repositories/mikro-orm/public-file.repository';

@Entity({ customRepository: () => PublicFileRepository })
class PublicFile extends BaseEntity {
  [EntityRepositoryType]?: PublicFileRepository;

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

  @OneToOne(() => User, (owner) => owner.publicFile)
  owner!: User;
}

export default PublicFile;

import { EnvironmentConfigModule } from '../../config/environment-config/environment-config.module';
import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MikroOrmConfigModule } from '../../config/mikro-orm/mikroorm.module';
import File from '../../entities/mikro-orm/file.entity';
import { FileRepository } from './file.repository';
import User from '../../entities/mikro-orm/user.entity';
import { UserRepository } from './user.repository';
import { FolderRepository } from './folder.repository';
import Folder from '../../entities/mikro-orm/folder.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([File]),
    MikroOrmModule.forFeature([User]),
    MikroOrmModule.forFeature([Folder]),
    MikroOrmConfigModule,
    EnvironmentConfigModule,
  ],
  providers: [FileRepository, UserRepository, FolderRepository],
  exports: [FileRepository, UserRepository, FolderRepository],
})
export class MikroOrmRepositoriesModule {}

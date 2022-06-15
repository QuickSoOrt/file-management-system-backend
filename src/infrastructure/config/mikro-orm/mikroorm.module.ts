import { Module } from '@nestjs/common';
import { EnvironmentConfigModule } from '../environment-config/environment-config.module';
import { MongoDBEnvironmentConfigService } from '../environment-config/mongodb/mongodb-environment-config.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BaseEntity, Options } from '@mikro-orm/core';
import File from '../../entities/mikro-orm/file.entity';
import User from '../../entities/mikro-orm/user.entity';
import Folder from '../../entities/mikro-orm/folder.entity';
import FolderPermission from '../../entities/mikro-orm/folder-permission';
import FilePermission from '../../entities/mikro-orm/file-permission';
import PublicFile from '../../entities/mikro-orm/public-file';

export const getMikroOrmModuleOptions = (
  config: MongoDBEnvironmentConfigService,
): Options =>
  ({
    entities: [
      File,
      User,
      Folder,
      FolderPermission,
      FilePermission,
      PublicFile,
    ],
    type: 'mongo',
    clientUrl: config.getDatabaseURL(),
    debug: true,
  } as Options);

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [MongoDBEnvironmentConfigService],
      useFactory: getMikroOrmModuleOptions,
    }),
  ],
})
export class MikroOrmConfigModule {}

import { TypeOrmConfigModule } from '../../config/typeorm/typeorm.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentConfigModule } from '../../config/environment-config/environment-config.module';
import { MappersModule } from '../../mappers/mappers.module';
import Folder from '../../entities/type-orm/folder.entity';
import User from '../../entities/type-orm/user.entity';
import File from '../../entities/type-orm/file.entity';
import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { FolderRepository } from './folder.repository';
import { FileRepository } from './file.repository';

@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Folder]),
    TypeOrmModule.forFeature([File]),
    MappersModule,
    EnvironmentConfigModule,
  ],
  providers: [UserRepository, FolderRepository, FileRepository],
  exports: [UserRepository, FolderRepository, FileRepository],
})
export class TypeOrmRepositoriesModule {}

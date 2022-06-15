import { Module } from '@nestjs/common';
import { UserMapper } from './user.mapper';
import { FolderMapper } from './folder.mapper';
import { FileMapper } from './file.mapper';

@Module({
  providers: [UserMapper, FolderMapper, FileMapper],
  exports: [UserMapper, FolderMapper, FileMapper],
})
export class MappersModule {}

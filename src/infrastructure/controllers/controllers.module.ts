import { Module } from '@nestjs/common';
import { AuthUseCasesProxyModule } from '../usecases-proxy/auth-use-cases-proxy.module';
import { AuthController } from './auth/auth.controller';
import { MappersModule } from '../mappers/mappers.module';
import { FolderUseCasesProxyModule } from '../usecases-proxy/folder-use-cases-proxy.module';
import { FolderController } from './folder/folder.controller';
import { FileController } from './file/file.controller';
import { FileUseCasesProxyModule } from '../usecases-proxy/file-use-cases-proxy.module';
import { UserController } from './user/user.controller';
import { UserUseCasesProxyModule } from '../usecases-proxy/user-use-cases-proxy.module';

@Module({
  imports: [
    AuthUseCasesProxyModule.register(),
    FolderUseCasesProxyModule.register(),
    FileUseCasesProxyModule.register(),
    UserUseCasesProxyModule.register(),
    MappersModule,
  ],
  controllers: [
    AuthController,
    FolderController,
    FileController,
    UserController,
  ],
})
export class ControllersModule {}

import { DynamicModule, Module } from '@nestjs/common';
import { UseCaseProxy } from './usecase-proxy';
import { LoggerService } from '../logger/logger.service';
import { LoggerModule } from '../logger/logger.module';
import { CreateFolderUseCase } from '../../usecases/folder/create-folder/create-folder.use-case';
import { UnitOfWork } from '../repositories/unit-of-work/unit-of-work';
import { UnitOfWorkModule } from '../repositories/unit-of-work/unit-of-work.module';
import { MappersModule } from '../mappers/mappers.module';
import { FolderMapper } from '../mappers/folder.mapper';
import { FsModule } from '../services/fs.module';
import { FsService } from '../services/fs.service';
import { DeleteFolderUseCase } from '../../usecases/folder/delete-folder/delete-folder.use-case';
import { RenameFolderUseCase } from '../../usecases/folder/rename-folder/rename-folder.use-case';
import { GetFoldersUseCase } from '../../usecases/folder/get-folders/get-folders.use-case';
import { MoveFolderUseCase } from '../../usecases/folder/move-folder/move-folder-use-case';
import { ShareFolderUseCase } from '../../usecases/folder/share-folder/share-folder.use-case';
import { UnshareFolderUseCase } from '../../usecases/folder/unshare-folder/unshare-folder.use-case';
import { GetSharedFoldersUseCase } from '../../usecases/folder/get-shared-folders/get-shared-folders.use-case';
import { CreateSharedFolderUseCase } from '../../usecases/folder/create-shared-folder/create-shared-folder.use-case';
import { DeleteSharedFolderUseCase } from '../../usecases/folder/delete-shared-folder/delete-shared-folder.use-case';

@Module({
  imports: [LoggerModule, UnitOfWorkModule, MappersModule, FsModule],
})
export class FolderUseCasesProxyModule {
  static UPLOAD_FOLDER_USECASE_PROXY = 'UploadFolderUseCaseProxy';
  static CREATE_FOLDER_USECASE_PROXY = 'CreateFolderUseCaseProxy';
  static CREATE_SHARED_FOLDER_USECASE_PROXY = 'CreateSharedFolderUseCaseProxy';
  static GET_FOLDERS_USECASE_PROXY = 'GetFoldersUseCaseProxy';
  static RENAME_FOLDER_USECASE_PROXY = 'RenameFolderUseCaseProxy';
  static DELETE_FOLDER_USECASE_PROXY = 'DeleteFolderUseCaseProxy';
  static DELETE_SHARED_FOLDER_USECASE_PROXY = 'DeleteSharedFolderUseCaseProxy';
  static MOVE_FOLDER_USECASE_PROXY = 'MoveFolderUseCaseProxy';
  static SHARE_FOLDER_USECASE_PROXY = 'ShareFolderUseCaseProxy';
  static UNSHARE_FOLDER_USECASE_PROXY = 'UnshareFolderUseCaseProxy';
  static GET_SHARED_FOLDERS_USECASE_PROXY = 'GetSharedFolderUseCaseProxy';

  static register(): DynamicModule {
    return {
      module: FolderUseCasesProxyModule,
      providers: [
        {
          inject: [LoggerService, UnitOfWork, FsService, FolderMapper],
          provide: FolderUseCasesProxyModule.CREATE_FOLDER_USECASE_PROXY,
          useFactory: (
            logger: LoggerService,
            unitOfWork: UnitOfWork,
            fsService: FsService,
            folderMapper: FolderMapper,
          ) =>
            new UseCaseProxy(
              new CreateFolderUseCase(
                logger,
                unitOfWork,
                fsService,
                folderMapper,
              ),
            ),
        },
        {
          inject: [LoggerService, UnitOfWork, FsService, FolderMapper],
          provide: FolderUseCasesProxyModule.CREATE_SHARED_FOLDER_USECASE_PROXY,
          useFactory: (
            logger: LoggerService,
            unitOfWork: UnitOfWork,
            fsService: FsService,
            folderMapper: FolderMapper,
          ) =>
            new UseCaseProxy(
              new CreateSharedFolderUseCase(
                logger,
                unitOfWork,
                fsService,
                folderMapper,
              ),
            ),
        },
        /*{
          inject: [LoggerService, FolderRepository],
          provide: FolderUseCasesProxyModule.UPLOAD_FOLDER_USECASE_PROXY,
          useFactory: (
            logger: LoggerService,
            folderRepository: FolderRepository,
          ) =>
            new UseCaseProxy(new UploadFolderUseCase(logger, folderRepository)),
        },*/
        {
          inject: [LoggerService, UnitOfWork, FolderMapper],
          provide: FolderUseCasesProxyModule.GET_FOLDERS_USECASE_PROXY,
          useFactory: (
            logger: LoggerService,
            unitOfWork: UnitOfWork,
            folderMapper: FolderMapper,
          ) =>
            new UseCaseProxy(
              new GetFoldersUseCase(logger, unitOfWork, folderMapper),
            ),
        },
        {
          inject: [LoggerService, UnitOfWork, FsService, FolderMapper],
          provide: FolderUseCasesProxyModule.RENAME_FOLDER_USECASE_PROXY,
          useFactory: (
            logger: LoggerService,
            unitOfWork: UnitOfWork,
            fsService: FsService,
            folderMapper: FolderMapper,
          ) =>
            new UseCaseProxy(
              new RenameFolderUseCase(
                logger,
                unitOfWork,
                fsService,
                folderMapper,
              ),
            ),
        },
        {
          inject: [LoggerService, UnitOfWork, FsService],
          provide: FolderUseCasesProxyModule.DELETE_FOLDER_USECASE_PROXY,
          useFactory: (
            logger: LoggerService,
            unitOfWork: UnitOfWork,
            fsService: FsService,
          ) =>
            new UseCaseProxy(
              new DeleteFolderUseCase(logger, unitOfWork, fsService),
            ),
        },
        {
          inject: [LoggerService, UnitOfWork, FsService],
          provide: FolderUseCasesProxyModule.DELETE_SHARED_FOLDER_USECASE_PROXY,
          useFactory: (
            logger: LoggerService,
            unitOfWork: UnitOfWork,
            fsService: FsService,
          ) =>
            new UseCaseProxy(
              new DeleteSharedFolderUseCase(logger, unitOfWork, fsService),
            ),
        },
        {
          inject: [LoggerService, UnitOfWork, FsService, FolderMapper],
          provide: FolderUseCasesProxyModule.MOVE_FOLDER_USECASE_PROXY,
          useFactory: (
            logger: LoggerService,
            unitOfWork: UnitOfWork,
            fsService: FsService,
            folderMapper: FolderMapper,
          ) =>
            new UseCaseProxy(
              new MoveFolderUseCase(
                logger,
                unitOfWork,
                fsService,
                folderMapper,
              ),
            ),
        },
        {
          inject: [LoggerService, UnitOfWork],
          provide: FolderUseCasesProxyModule.SHARE_FOLDER_USECASE_PROXY,
          useFactory: (logger: LoggerService, unitOfWork: UnitOfWork) =>
            new UseCaseProxy(new ShareFolderUseCase(logger, unitOfWork)),
        },
        {
          inject: [LoggerService, UnitOfWork],
          provide: FolderUseCasesProxyModule.UNSHARE_FOLDER_USECASE_PROXY,
          useFactory: (logger: LoggerService, unitOfWork: UnitOfWork) =>
            new UseCaseProxy(new UnshareFolderUseCase(logger, unitOfWork)),
        },
        {
          inject: [LoggerService, UnitOfWork, FolderMapper],
          provide: FolderUseCasesProxyModule.GET_SHARED_FOLDERS_USECASE_PROXY,
          useFactory: (
            logger: LoggerService,
            unitOfWork: UnitOfWork,
            folderMapper: FolderMapper,
          ) =>
            new UseCaseProxy(
              new GetSharedFoldersUseCase(logger, unitOfWork, folderMapper),
            ),
        },
      ],
      exports: [
        /*FolderUseCasesProxyModule.UPLOAD_FOLDER_USECASE_PROXY,*/
        FolderUseCasesProxyModule.CREATE_FOLDER_USECASE_PROXY,
        FolderUseCasesProxyModule.CREATE_SHARED_FOLDER_USECASE_PROXY,
        FolderUseCasesProxyModule.GET_FOLDERS_USECASE_PROXY,
        FolderUseCasesProxyModule.RENAME_FOLDER_USECASE_PROXY,
        FolderUseCasesProxyModule.DELETE_FOLDER_USECASE_PROXY,
        FolderUseCasesProxyModule.DELETE_SHARED_FOLDER_USECASE_PROXY,
        FolderUseCasesProxyModule.MOVE_FOLDER_USECASE_PROXY,
        FolderUseCasesProxyModule.SHARE_FOLDER_USECASE_PROXY,
        FolderUseCasesProxyModule.UNSHARE_FOLDER_USECASE_PROXY,
        FolderUseCasesProxyModule.GET_SHARED_FOLDERS_USECASE_PROXY,
      ],
    };
  }
}

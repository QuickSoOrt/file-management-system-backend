import { DynamicModule, Module } from '@nestjs/common';
import { UseCaseProxy } from './usecase-proxy';
import { LoggerService } from '../logger/logger.service';
import { LoggerModule } from '../logger/logger.module';
import { UploadFileUseCase } from '../../usecases/file/upload-file/upload-file.use-case';
import { GetFilesUseCase } from '../../usecases/file/get-files/get-files.use-case';
import { DeleteFileUseCase } from '../../usecases/file/delete-file/delete-file.use-case';
import { RenameFileUseCase } from '../../usecases/file/rename-file/rename-file.use-case';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
import { UnitOfWorkModule } from '../repositories/unit-of-work/unit-of-work.module';
import { UnitOfWork } from '../repositories/unit-of-work/unit-of-work';
import { FsService } from '../services/fs.service';
import { FsModule } from '../services/fs.module';
import { FileMapper } from '../mappers/file.mapper';
import { MappersModule } from '../mappers/mappers.module';
import { GetFileContentUseCase } from '../../usecases/file/get-file-content/get-file-content-use-case';
import { MoveFileUseCase } from '../../usecases/file/move-file/move-file.use-case';
import { ShareFileUseCase } from '../../usecases/file/share-file/share-file.use-case';
import { UnshareFileUseCase } from '../../usecases/file/unshare-file/unshare-file.use-case';
import { GetSharedFilesUseCase } from '../../usecases/file/get-shared-files/get-shared-files.use-case';
import { DownloadFileUseCase } from '../../usecases/file/download-file/download-file-use-case';
import { UploadPublicFileUseCase } from '../../usecases/file/upload-public-file/upload-public-file.use-case';

@Module({
  imports: [
    LoggerModule,
    UnitOfWorkModule,
    EnvironmentConfigModule,
    FsModule,
    MappersModule,
  ],
})
export class FileUseCasesProxyModule {
  static UPLOAD_FILE_USECASE_PROXY = 'UploadFileUseCaseProxy';
  static UPLOAD_PUBLIC_FILE_USECASE_PROXY = 'UploadPublicFileUseCaseProxy';
  static GET_FILES_USECASE_PROXY = 'GetFilesUseCaseProxy';
  static GET_FILE_CONTENT_USECASE_PROXY = 'GetFileContentUseCaseProxy';
  static RENAME_FILE_USECASE_PROXY = 'RenameFileUseCaseProxy';
  static DELETE_FILE_USECASE_PROXY = 'DeleteFileUseCaseProxy';
  static MOVE_FILE_USECASE_PROXY = 'MoveFileUseCaseProxy';
  static SHARE_FILE_USECASE_PROXY = 'ShareFileUseCaseProxy';
  static UNSHARE_FILE_USECASE_PROXY = 'UnshareFileUseCaseProxy';
  static GET_SHARED_FILES_USECASE_PROXY = 'GetSharedFilesUseCaseProxy';
  static DOWNLOAD_FILE_USECASE_PROXY = 'DownloadFileUseCaseProxy';

  static register(): DynamicModule {
    return {
      module: FileUseCasesProxyModule,
      providers: [
        {
          inject: [LoggerService, FsService, UnitOfWork, FileMapper],
          provide: FileUseCasesProxyModule.UPLOAD_PUBLIC_FILE_USECASE_PROXY,
          useFactory: (
            logger: LoggerService,
            fsService: FsService,
            unitOfWork: UnitOfWork,
            fileMapper: FileMapper,
          ) =>
            new UseCaseProxy(
              new UploadPublicFileUseCase(
                logger,
                fsService,
                unitOfWork,
                fileMapper,
              ),
            ),
        },
        {
          inject: [LoggerService, FsService, UnitOfWork, FileMapper],
          provide: FileUseCasesProxyModule.UPLOAD_FILE_USECASE_PROXY,
          useFactory: (
            logger: LoggerService,
            fsService: FsService,
            unitOfWork: UnitOfWork,
            fileMapper: FileMapper,
          ) =>
            new UseCaseProxy(
              new UploadFileUseCase(logger, fsService, unitOfWork, fileMapper),
            ),
        },
        {
          inject: [LoggerService, UnitOfWork, FileMapper],
          provide: FileUseCasesProxyModule.GET_FILES_USECASE_PROXY,
          useFactory: (
            logger: LoggerService,
            unitOfWork: UnitOfWork,
            fileMapper: FileMapper,
          ) =>
            new UseCaseProxy(
              new GetFilesUseCase(logger, unitOfWork, fileMapper),
            ),
        },
        {
          inject: [LoggerService, UnitOfWork, FsService],
          provide: FileUseCasesProxyModule.GET_FILE_CONTENT_USECASE_PROXY,
          useFactory: (
            logger: LoggerService,
            unitOfWork: UnitOfWork,
            fsService: FsService,
          ) =>
            new UseCaseProxy(
              new GetFileContentUseCase(logger, unitOfWork, fsService),
            ),
        },
        {
          inject: [LoggerService, UnitOfWork, FsService],
          provide: FileUseCasesProxyModule.DELETE_FILE_USECASE_PROXY,
          useFactory: (
            logger: LoggerService,
            unitOfWork: UnitOfWork,
            fsService: FsService,
          ) =>
            new UseCaseProxy(
              new DeleteFileUseCase(logger, unitOfWork, fsService),
            ),
        },
        {
          inject: [LoggerService, UnitOfWork, FsService, FileMapper],
          provide: FileUseCasesProxyModule.RENAME_FILE_USECASE_PROXY,
          useFactory: (
            logger: LoggerService,
            unitOfWork: UnitOfWork,
            fsService: FsService,
            fileMapper: FileMapper,
          ) =>
            new UseCaseProxy(
              new RenameFileUseCase(logger, unitOfWork, fsService, fileMapper),
            ),
        },
        {
          inject: [LoggerService, UnitOfWork, FsService, FileMapper],
          provide: FileUseCasesProxyModule.MOVE_FILE_USECASE_PROXY,
          useFactory: (
            logger: LoggerService,
            unitOfWork: UnitOfWork,
            fsService: FsService,
            fileMapper: FileMapper,
          ) =>
            new UseCaseProxy(
              new MoveFileUseCase(logger, unitOfWork, fsService, fileMapper),
            ),
        },
        {
          inject: [LoggerService, UnitOfWork],
          provide: FileUseCasesProxyModule.SHARE_FILE_USECASE_PROXY,
          useFactory: (logger: LoggerService, unitOfWork: UnitOfWork) =>
            new UseCaseProxy(new ShareFileUseCase(logger, unitOfWork)),
        },
        {
          inject: [LoggerService, UnitOfWork],
          provide: FileUseCasesProxyModule.UNSHARE_FILE_USECASE_PROXY,
          useFactory: (logger: LoggerService, unitOfWork: UnitOfWork) =>
            new UseCaseProxy(new UnshareFileUseCase(logger, unitOfWork)),
        },
        {
          inject: [LoggerService, UnitOfWork, FileMapper],
          provide: FileUseCasesProxyModule.GET_SHARED_FILES_USECASE_PROXY,
          useFactory: (
            logger: LoggerService,
            unitOfWork: UnitOfWork,
            fileMapper: FileMapper,
          ) =>
            new UseCaseProxy(
              new GetSharedFilesUseCase(logger, unitOfWork, fileMapper),
            ),
        },
        {
          inject: [LoggerService, UnitOfWork, FsService, FileMapper],
          provide: FileUseCasesProxyModule.DOWNLOAD_FILE_USECASE_PROXY,
          useFactory: (
            logger: LoggerService,
            unitOfWork: UnitOfWork,
            fsService: FsService,
            fileMapper: FileMapper,
          ) =>
            new UseCaseProxy(
              new DownloadFileUseCase(
                logger,
                unitOfWork,
                fsService,
                fileMapper,
              ),
            ),
        },
      ],
      exports: [
        FileUseCasesProxyModule.DELETE_FILE_USECASE_PROXY,
        FileUseCasesProxyModule.GET_FILES_USECASE_PROXY,
        FileUseCasesProxyModule.GET_FILE_CONTENT_USECASE_PROXY,
        FileUseCasesProxyModule.RENAME_FILE_USECASE_PROXY,
        FileUseCasesProxyModule.UPLOAD_FILE_USECASE_PROXY,
        FileUseCasesProxyModule.UPLOAD_PUBLIC_FILE_USECASE_PROXY,
        FileUseCasesProxyModule.MOVE_FILE_USECASE_PROXY,
        FileUseCasesProxyModule.SHARE_FILE_USECASE_PROXY,
        FileUseCasesProxyModule.UNSHARE_FILE_USECASE_PROXY,
        FileUseCasesProxyModule.GET_SHARED_FILES_USECASE_PROXY,
        FileUseCasesProxyModule.DOWNLOAD_FILE_USECASE_PROXY,
      ],
    };
  }
}

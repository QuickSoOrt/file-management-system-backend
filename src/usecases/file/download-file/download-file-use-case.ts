import { ILogger } from '../../../domain/logger/logger.interface';
import { UnitOfWork } from '../../../infrastructure/repositories/unit-of-work/unit-of-work';
import { NotFoundException } from '@nestjs/common';
import * as util from 'util';
import { ErrorMessage } from '../../../domain/error-messages/error-message';
import { FsService } from '../../../infrastructure/services/fs.service';
import { DownloadFileUseCaseResponse } from './download-file-use-case-response';
import { DownloadFileUseCaseRequest } from './download-file-use-case-request';
import { FileMapper } from '../../../infrastructure/mappers/file.mapper';

export class DownloadFileUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly unitOfWork: UnitOfWork,
    private readonly fsService: FsService,
    private readonly fileMapper: FileMapper,
  ) {}

  async execute(
    request: DownloadFileUseCaseRequest,
  ): Promise<DownloadFileUseCaseResponse> {
    const { ownerId, fileId } = request;

    const user = await this.unitOfWork.getUserRepository().findById(ownerId);

    const userFile = await this.unitOfWork.getFileRepository().findById(fileId);

    if (userFile) {
      const filePermission = await this.unitOfWork
        .getFilePermissionRepository()
        .findByUserAndFile(user, userFile);

      if (userFile.owner.id !== ownerId && !filePermission) {
        throw new NotFoundException(
          util.format(ErrorMessage.FILE_NOT_FOUND, fileId),
        );
      }
    } else {
      throw new NotFoundException(
        util.format(ErrorMessage.FILE_NOT_FOUND, fileId),
      );
    }

    let fileToDownload;

    if (userFile.owner.id === ownerId) {
      fileToDownload = await this.fsService.readFile(
        userFile.IV,
        ownerId + userFile.path,
      );
    } else {
      fileToDownload = await this.fsService.readFile(
        userFile.IV,
        userFile.owner.id + userFile.path,
      );
    }

    const downloadFileUseCaseResponse: DownloadFileUseCaseResponse =
      new DownloadFileUseCaseResponse(
        this.fileMapper.fromFileToFileModel(userFile),
        fileToDownload,
      );

    return downloadFileUseCaseResponse;
  }
}

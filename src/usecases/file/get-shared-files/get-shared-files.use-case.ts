import { ILogger } from '../../../domain/logger/logger.interface';
import { UnitOfWork } from '../../../infrastructure/repositories/unit-of-work/unit-of-work';
import { FileMapper } from '../../../infrastructure/mappers/file.mapper';
import { NotFoundException } from '@nestjs/common';
import * as util from 'util';
import { ErrorMessage } from '../../../domain/error-messages/error-message';
import { GetSharedFilesUseCaseRequest } from './get-shared-files-use-case.request';
import { GetSharedFilesUseCaseResponse } from './get-shared-files.use-case-response';

export class GetSharedFilesUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly unitOfWork: UnitOfWork,
    private readonly fileMapper: FileMapper,
  ) {}

  async execute(
    request: GetSharedFilesUseCaseRequest,
  ): Promise<GetSharedFilesUseCaseResponse> {
    const { ownerId, parentFolderId } = request;

    const user = await this.unitOfWork.getUserRepository().findById(ownerId);
    if (!user) {
      throw new NotFoundException(
        util.format(ErrorMessage.USER_NOT_FOUND, ownerId),
      );
    }

    const folder = await this.unitOfWork
      .getFolderRepository()
      .findById(parentFolderId);

    if (parentFolderId) {
      if (!folder) {
        throw new NotFoundException(
          util.format(ErrorMessage.FOLDER_NOT_FOUND, parentFolderId),
        );
      }
    }

    const files = [];

    const filesPermissions = await this.unitOfWork
      .getFilePermissionRepository()
      .findPermissions(user);

    for (const permission of filesPermissions) {
      const file = permission.file;
      files.push(file);
      for (const permissionAux of filesPermissions) {
        const fileAux = permissionAux.file;
        if (file.id !== fileAux.id) {
          if (parentFolderId) {
            if (file.folder && file.folder.id !== parentFolderId) {
              files.pop();
            } else if (!file.folder) {
              files.pop();
            }
          } else {
            if (file.folder && file.folder.id === fileAux.id) {
              files.pop();
            }
          }
        }
      }
    }

    const response: GetSharedFilesUseCaseResponse =
      new GetSharedFilesUseCaseResponse();

    response.files = files.map((f) => this.fileMapper.fromFileToFileModel(f));

    return response;
  }
}

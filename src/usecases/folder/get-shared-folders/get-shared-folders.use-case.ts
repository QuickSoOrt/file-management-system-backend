import { ILogger } from '../../../domain/logger/logger.interface';
import { UnitOfWork } from '../../../infrastructure/repositories/unit-of-work/unit-of-work';
import { FolderMapper } from '../../../infrastructure/mappers/folder.mapper';
import { NotFoundException } from '@nestjs/common';
import util from 'util';
import { ErrorMessage } from '../../../domain/error-messages/error-message';
import { GetSharedFoldersUseCaseResponse } from './get-shared-folders-use-case-response';
import { GetSharedFoldersUseCaseRequest } from './get-shared-folders-use-case-request';

export class GetSharedFoldersUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly unitOfWork: UnitOfWork,
    private readonly folderMapper: FolderMapper,
  ) {}

  async execute(
    request: GetSharedFoldersUseCaseRequest,
  ): Promise<GetSharedFoldersUseCaseResponse> {
    const { ownerId, parentId } = request;

    const user = await this.unitOfWork.getUserRepository().findById(ownerId);
    if (!user) {
      throw new NotFoundException(
        util.format(ErrorMessage.USER_NOT_FOUND, ownerId),
      );
    }

    const folder = await this.unitOfWork
      .getFolderRepository()
      .findById(parentId);

    if (parentId) {
      if (!folder) {
        throw new NotFoundException(
          util.format(ErrorMessage.FOLDER_NOT_FOUND, parentId),
        );
      }
    }

    const folders = [];

    const foldersPermissions = await this.unitOfWork
      .getFolderPermissionRepository()
      .findUserPermissions(user);

    for (const permission of foldersPermissions) {
      const folder = permission.folder;
      folders.push(folder);
      for (const permissionAux of foldersPermissions) {
        const folderAux = permissionAux.folder;
        if (folder.id !== folderAux.id) {
          if (parentId) {
            if (folder.parent && folder.parent.id !== parentId) {
              folders.pop();
            } else if (!folder.parent) {
              folders.pop();
            }
          } else {
            if (folder.parent && folder.parent.id === folderAux.id) {
              folders.pop();
            }
          }
        }
      }
    }

    const response: GetSharedFoldersUseCaseResponse =
      new GetSharedFoldersUseCaseResponse();

    folders.forEach((f) => {
      console.log(f);
    });

    response.folders = folders.map((f) =>
      this.folderMapper.fromFolderToFolderModel(f),
    );

    return response;
  }
}

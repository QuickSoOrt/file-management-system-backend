import { ILogger } from '../../../domain/logger/logger.interface';
import { UnitOfWork } from '../../../infrastructure/repositories/unit-of-work/unit-of-work';
import { NotFoundException } from '@nestjs/common';
import * as util from 'util';
import { ErrorMessage } from '../../../domain/error-messages/error-message';
import FolderPermission from '../../../infrastructure/entities/mikro-orm/folder-permission';
import FilePermission from '../../../infrastructure/entities/mikro-orm/file-permission';
import { AccessTypeEnum } from '../../../infrastructure/entities/mikro-orm/access-type.enum';
import { UnshareFolderUseCaseRequest } from './unshare-folder-use-case.request';
import { UnshareFolderUseCaseResponse } from './unshare-folder-use-case-response';

export class UnshareFolderUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async execute(
    request: UnshareFolderUseCaseRequest,
  ): Promise<UnshareFolderUseCaseResponse> {
    const { ownerId, folderId, usersToUnshareWith } = request;

    const owner = await this.unitOfWork.getUserRepository().findById(ownerId);

    if (!owner) {
      throw new NotFoundException(
        util.format(ErrorMessage.USER_NOT_FOUND, ownerId),
      );
    }

    const folder = await this.unitOfWork
      .getFolderRepository()
      .findByIdAndOwner(owner, folderId);

    if (!folder) {
      throw new NotFoundException(
        util.format(ErrorMessage.FOLDER_NOT_FOUND, folderId),
      );
    }

    const folderPermissions: FolderPermission[] = [];
    const filePermissions: FilePermission[] = [];

    const folders = await this.unitOfWork
      .getFolderRepository()
      .findFoldersAndSubFoldersByPath(folder.path);

    const files = await this.unitOfWork
      .getFileRepository()
      .findSubFiles(folder.path);

    for (let i = 0; i < usersToUnshareWith.length; i++) {
      if (usersToUnshareWith[i] != ownerId) {
        const user = await this.unitOfWork
          .getUserRepository()
          .findById(usersToUnshareWith[i]);
        if (user) {
          for (const fileAux of files) {
            const filePermission = await this.unitOfWork
              .getFilePermissionRepository()
              .findByUserAndFile(user, fileAux);
            if (filePermission) {
              filePermissions.push(filePermission);
            }
          }
          for (const folderAux of folders) {
            const folderPermission = await this.unitOfWork
              .getFolderPermissionRepository()
              .findByUserAndFolder(user, folderAux);
            if (folderPermission) {
              folderPermissions.push(folderPermission);
            }
          }
        }
      }
    }

    await this.unitOfWork.getManager().transactional(async () => {
      await this.unitOfWork
        .getFilePermissionRepository()
        .deletePermissions(filePermissions);
      await this.unitOfWork
        .getFolderPermissionRepository()
        .deletePermissions(folderPermissions);
      await this.unitOfWork.save();
    });

    const unshareFolderUseCaseResponse: UnshareFolderUseCaseResponse =
      new UnshareFolderUseCaseResponse();

    return unshareFolderUseCaseResponse;
  }
}

import { ILogger } from '../../../domain/logger/logger.interface';
import { UnitOfWork } from '../../../infrastructure/repositories/unit-of-work/unit-of-work';
import { ShareFolderUseCaseResponse } from './share-folder-use-case-response';
import { ShareFolderUseCaseRequest } from './share-folder-use-case-request';
import { NotFoundException } from '@nestjs/common';
import * as util from 'util';
import { ErrorMessage } from '../../../domain/error-messages/error-message';
import FolderPermission from '../../../infrastructure/entities/mikro-orm/folder-permission';
import FilePermission from '../../../infrastructure/entities/mikro-orm/file-permission';
import { AccessTypeEnum } from '../../../infrastructure/entities/mikro-orm/access-type.enum';

export class ShareFolderUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async execute(
    request: ShareFolderUseCaseRequest,
  ): Promise<ShareFolderUseCaseResponse> {
    const { ownerId, folderId, usersToShareWith } = request;

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

    for (let i = 0; i < usersToShareWith.length; i++) {
      if (usersToShareWith[i] != ownerId) {
        const user = await this.unitOfWork
          .getUserRepository()
          .findById(usersToShareWith[i]);
        if (user) {
          for (const fileAux of files) {
            let filePermission = await this.unitOfWork
              .getFilePermissionRepository()
              .findByUserAndFile(user, fileAux);
            if (!filePermission) {
              filePermission = new FilePermission();
              filePermission.user = user;
              filePermission.file = fileAux;
              filePermission.accessType = AccessTypeEnum.READ_WRITE;
              filePermissions.push(filePermission);
            }
          }
          for (const folderAux of folders) {
            let folderPermission = await this.unitOfWork
              .getFolderPermissionRepository()
              .findByUserAndFolder(user, folderAux);
            if (!folderPermission) {
              folderPermission = new FolderPermission();
              folderPermission.user = user;
              folderPermission.folder = folderAux;
              folderPermission.accessType = AccessTypeEnum.READ_WRITE;
              folderPermissions.push(folderPermission);
            }
          }
        }
      }
    }

    await this.unitOfWork.getManager().transactional(async () => {
      await this.unitOfWork
        .getFilePermissionRepository()
        .insertPermissions(filePermissions);
      await this.unitOfWork
        .getFolderPermissionRepository()
        .insertPermissions(folderPermissions);
      await this.unitOfWork.save();
    });

    const shareFolderUseCaseResponse: ShareFolderUseCaseResponse =
      new ShareFolderUseCaseResponse();

    return shareFolderUseCaseResponse;
  }
}

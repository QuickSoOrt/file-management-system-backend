import { NotFoundException } from '@nestjs/common';
import { ILogger } from '../../../domain/logger/logger.interface';
import { ErrorMessage } from '../../../domain/error-messages/error-message';
import * as util from 'util';
import { DeleteSharedFolderUseCaseRequest } from './delete-shared-folder-use-case.request';
import { DeleteSharedFolderUseCaseResponse } from './delete-shared-folder-use-case-response';
import { UnitOfWork } from '../../../infrastructure/repositories/unit-of-work/unit-of-work';
import { FsService } from '../../../infrastructure/services/fs.service';

export class DeleteSharedFolderUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly unitOfWork: UnitOfWork,
    private readonly fsService: FsService,
  ) {}

  async execute(
    request: DeleteSharedFolderUseCaseRequest,
  ): Promise<DeleteSharedFolderUseCaseResponse> {
    const { userId, folderId } = request;

    const user = await this.unitOfWork.getUserRepository().findById(userId);
    if (!user) {
      throw new NotFoundException(
        util.format(ErrorMessage.USER_NOT_FOUND, userId),
      );
    }

    const folder = await this.unitOfWork
      .getFolderRepository()
      .findById(folderId);

    if (!folder) {
      throw new NotFoundException(
        util.format(ErrorMessage.FOLDER_NOT_FOUND, folderId),
      );
    }

    const permission = await this.unitOfWork
      .getFolderPermissionRepository()
      .findByUserAndFolder(user, folder);

    if (!permission) {
      throw new NotFoundException(
        ErrorMessage.INVALID_FOLDER_ACCESS_PERMISSION,
      );
    }

    const permissions = await this.unitOfWork
      .getFolderPermissionRepository()
      .findFolderPermissions(folder);

    await this.unitOfWork.getManager().transactional(async () => {
      await this.unitOfWork.getFolderRepository().deleteFolder(folder.id);
      await this.unitOfWork.getFolderPermissionRepository().deletePermissions(permissions);
      await this.fsService.deleteFolder(folder.owner.id + folder.path);
      await this.unitOfWork.save();
    });

    return new DeleteSharedFolderUseCaseResponse();
  }
}

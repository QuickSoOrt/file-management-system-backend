import { NotFoundException } from '@nestjs/common';
import { ILogger } from '../../../domain/logger/logger.interface';
import { ErrorMessage } from '../../../domain/error-messages/error-message';
import * as util from 'util';
import { DeleteFolderUseCaseRequest } from './delete-folder-use-case.request';
import { DeleteFolderUseCaseResponse } from './delete-folder-use-case-response';
import { UnitOfWork } from '../../../infrastructure/repositories/unit-of-work/unit-of-work';
import { FsService } from '../../../infrastructure/services/fs.service';

export class DeleteFolderUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly unitOfWork: UnitOfWork,
    private readonly fsService: FsService,
  ) {}

  async execute(
    request: DeleteFolderUseCaseRequest,
  ): Promise<DeleteFolderUseCaseResponse> {
    const { ownerId, folderId } = request;

    const user = await this.unitOfWork.getUserRepository().findById(ownerId);
    if (!user) {
      throw new NotFoundException(
        util.format(ErrorMessage.USER_NOT_FOUND, ownerId),
      );
    }

    const folder = await this.unitOfWork
      .getFolderRepository()
      .findByIdAndOwner(user, folderId);

    if (!folder) {
      throw new NotFoundException(
        util.format(ErrorMessage.FOLDER_NOT_FOUND, folderId),
      );
    }

    await this.unitOfWork.getManager().transactional(async () => {
      await this.unitOfWork.getFolderRepository().deleteFolder(folder.id);
      await this.fsService.deleteFolder(folder.owner.id + folder.path);
      await this.unitOfWork.save();
    });

    return new DeleteFolderUseCaseResponse();
  }
}

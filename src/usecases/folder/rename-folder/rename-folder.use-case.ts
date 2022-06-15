import {
  ConflictException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { ILogger } from '../../../domain/logger/logger.interface';
import { ErrorMessage } from '../../../domain/error-messages/error-message';
import * as util from 'util';
import { RenameFolderUseCaseRequest } from './rename-folder-use-case-request';
import { RenameFolderUseCaseResponse } from './rename-folder-use-case-response';
import { FolderRepository } from '../../../infrastructure/repositories/type-orm/folder.repository';
import { UnitOfWork } from '../../../infrastructure/repositories/unit-of-work/unit-of-work';
import { FsService } from '../../../infrastructure/services/fs.service';
import { FolderMapper } from '../../../infrastructure/mappers/folder.mapper';

export class RenameFolderUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly unitOfWork: UnitOfWork,
    private readonly fsService: FsService,
    private readonly folderMapper: FolderMapper,
  ) {}

  async execute(
    request: RenameFolderUseCaseRequest,
  ): Promise<RenameFolderUseCaseResponse> {
    const { ownerId, folderId, newName } = request;

    const user = await this.unitOfWork.getUserRepository().findById(ownerId);
    if (!user) {
      throw new NotFoundException(
        util.format(ErrorMessage.USER_NOT_FOUND, ownerId),
      );
    }

    const folder = await this.unitOfWork
      .getFolderRepository()
      .findByIdAndOwner(user, folderId);

    folder.name = newName;

    await this.unitOfWork.getManager().transactional(async () => {
      await this.unitOfWork.getFolderRepository().updateFolder(folder);
      await this.unitOfWork.save();
    });

    const renameFolderUseCaseResponse: RenameFolderUseCaseResponse =
      new RenameFolderUseCaseResponse();

    renameFolderUseCaseResponse.folder =
      this.folderMapper.fromFolderToFolderModel(folder);

    return renameFolderUseCaseResponse;
  }
}

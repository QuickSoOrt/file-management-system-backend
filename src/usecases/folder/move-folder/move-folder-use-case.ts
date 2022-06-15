import { NotFoundException } from '@nestjs/common';
import { ILogger } from '../../../domain/logger/logger.interface';
import { ErrorMessage } from '../../../domain/error-messages/error-message';
import * as util from 'util';
import { UnitOfWork } from '../../../infrastructure/repositories/unit-of-work/unit-of-work';
import { FsService } from '../../../infrastructure/services/fs.service';
import { FolderMapper } from '../../../infrastructure/mappers/folder.mapper';
import { MoveFolderUseCaseRequest } from './move-folder-use-case-request';
import { MoveFolderUseCaseResponse } from './move-folder-use-case-response';

export class MoveFolderUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly unitOfWork: UnitOfWork,
    private readonly fsService: FsService,
    private readonly folderMapper: FolderMapper,
  ) {}

  async execute(
    request: MoveFolderUseCaseRequest,
  ): Promise<MoveFolderUseCaseResponse> {
    const { ownerId, folderId, newParentFolderId } = request;

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

    const newParentfolder = await this.unitOfWork
      .getFolderRepository()
      .findById(newParentFolderId);

    if (newParentFolderId) {
      if (!newParentfolder) {
        throw new NotFoundException(
          util.format(ErrorMessage.FOLDER_NOT_FOUND, newParentFolderId),
        );
      }
    }

    const oldPath = folder.path;
    const newPath = newParentfolder
      ? newParentfolder.path + '/' + folder.systemName
      : '/' + folder.systemName;

    folder.parent = newParentfolder;
    folder.path = newPath;

    await this.unitOfWork.getManager().transactional(async () => {
      await this.unitOfWork.getFolderRepository().updateFolder(folder);
      await this.fsService.moveFolder(
        folder.owner.id + oldPath,
        folder.owner.id + newPath,
      );
      await this.unitOfWork.save();
    });

    const moveFolderUseCaseResponse: MoveFolderUseCaseResponse =
      new MoveFolderUseCaseResponse(
        this.folderMapper.fromFolderToFolderModel(folder),
      );

    return moveFolderUseCaseResponse;
  }
}

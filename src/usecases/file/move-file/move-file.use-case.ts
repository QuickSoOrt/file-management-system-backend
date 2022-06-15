import { NotFoundException } from '@nestjs/common';
import { ILogger } from '../../../domain/logger/logger.interface';
import { ErrorMessage } from '../../../domain/error-messages/error-message';
import * as util from 'util';
import * as mime from 'mime-types';
import { UnitOfWork } from '../../../infrastructure/repositories/unit-of-work/unit-of-work';
import { FsService } from '../../../infrastructure/services/fs.service';
import { MoveFileUseCaseResponse } from './move-file-use-case.response';
import { MoveFileUseCaseRequest } from './move-file-use-case.request';
import { FileMapper } from '../../../infrastructure/mappers/file.mapper';

export class MoveFileUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly unitOfWork: UnitOfWork,
    private readonly fsService: FsService,
    private readonly fileMapper: FileMapper,
  ) {}

  async execute(
    request: MoveFileUseCaseRequest,
  ): Promise<MoveFileUseCaseResponse> {
    const { ownerId, fileId, newParentFolderId } = request;

    const user = await this.unitOfWork.getUserRepository().findById(ownerId);

    const file = await this.unitOfWork
      .getFileRepository()
      .findByIdAndOwner(user, fileId);

    if (!file) {
      throw new NotFoundException(
        util.format(ErrorMessage.FILE_NOT_FOUND, fileId),
      );
    }

    const newParentfolder = await this.unitOfWork
      .getFolderRepository()
      .findByIdAndOwner(user, newParentFolderId);

    if (newParentFolderId) {
      if (!newParentfolder) {
        throw new NotFoundException(
          util.format(ErrorMessage.FOLDER_NOT_FOUND, newParentFolderId),
        );
      }
    }

    const oldPath = file.path;
    const newPath = newParentfolder
      ? newParentfolder.path +
        '/' +
        file.systemName +
        '.' +
        mime.extension(file.mimetype)
      : '/' + file.systemName + '.' + mime.extension(file.mimetype);

    file.folder = newParentfolder;
    file.path = newPath;

    console.log(oldPath);
    console.log(newPath);

    await this.unitOfWork.getManager().transactional(async () => {
      await this.unitOfWork.getFileRepository().updateFile(file);
      await this.fsService.moveFolder(
        file.owner.id + oldPath,
        file.owner.id + newPath,
      );
      await this.unitOfWork.save();
    });

    const moveFileUseCaseResponse: MoveFileUseCaseResponse =
      new MoveFileUseCaseResponse(this.fileMapper.fromFileToFileModel(file));

    return moveFileUseCaseResponse;
  }
}

import { ILogger } from '../../../domain/logger/logger.interface';
import { UnitOfWork } from '../../../infrastructure/repositories/unit-of-work/unit-of-work';
import { FsService } from '../../../infrastructure/services/fs.service';
import { RenameFileUseCaseRequest } from './rename-file-use-case-request';
import { RenameFileUseCaseResponse } from './rename-file-use-case-response';
import { NotFoundException } from '@nestjs/common';
import * as util from 'util';
import * as mime from 'mime-types';
import { ErrorMessage } from '../../../domain/error-messages/error-message';
import { FileMapper } from '../../../infrastructure/mappers/file.mapper';

export class RenameFileUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly unitOfWork: UnitOfWork,
    private readonly fsService: FsService,
    private readonly fileMapper: FileMapper,
  ) {}

  async execute(
    request: RenameFileUseCaseRequest,
  ): Promise<RenameFileUseCaseResponse> {
    const { ownerId, fileId, newName } = request;

    const user = await this.unitOfWork.getUserRepository().findById(ownerId);

    const file = await this.unitOfWork
      .getFileRepository()
      .findByIdAndOwner(user, fileId);

    if (!file) {
      throw new NotFoundException(
        util.format(ErrorMessage.FILE_NOT_FOUND, fileId),
      );
    }

    file.name = newName;

    await this.unitOfWork.getManager().transactional(async () => {
      await this.unitOfWork.getFileRepository().updateFile(file);
      await this.unitOfWork.save();
    });

    const renameFileUseCaseResponse: RenameFileUseCaseResponse =
      new RenameFileUseCaseResponse();

    renameFileUseCaseResponse.file = this.fileMapper.fromFileToFileModel(file);

    return renameFileUseCaseResponse;
  }
}

import { NotFoundException } from '@nestjs/common';
import { ILogger } from '../../../domain/logger/logger.interface';
import { DeleteFileUseCaseRequest } from './delete-file-use-case-request';
import { DeleteFileUseCaseResponse } from './delete-file-use-case-response';
import { UnitOfWork } from '../../../infrastructure/repositories/unit-of-work/unit-of-work';
import * as util from 'util';
import * as mime from 'mime-types';
import { ErrorMessage } from '../../../domain/error-messages/error-message';
import { FsService } from '../../../infrastructure/services/fs.service';

export class DeleteFileUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly unitOfWork: UnitOfWork,
    private readonly fsService: FsService,
  ) {}

  async execute(
    request: DeleteFileUseCaseRequest,
  ): Promise<DeleteFileUseCaseResponse> {
    const { ownerId, fileId } = request;

    const user = await this.unitOfWork.getUserRepository().findById(ownerId);

    const file = await this.unitOfWork
      .getFileRepository()
      .findByIdAndOwner(user, fileId);

    if (!file) {
      throw new NotFoundException(
        util.format(ErrorMessage.FILE_NOT_FOUND, fileId),
      );
    }

    await this.unitOfWork.getManager().transactional(async () => {
      await this.unitOfWork.getFileRepository().delete(file);
      await this.fsService.deleteFile(user.id + file.path);
      await this.unitOfWork.save();
    });

    return new DeleteFileUseCaseResponse();
  }
}

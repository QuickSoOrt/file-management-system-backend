import { NotFoundException } from '@nestjs/common';
import { ILogger } from '../../../domain/logger/logger.interface';
import { UnitOfWork } from '../../../infrastructure/repositories/unit-of-work/unit-of-work';
import * as util from 'util';
import * as mime from 'mime-types';
import { ErrorMessage } from '../../../domain/error-messages/error-message';
import { FsService } from '../../../infrastructure/services/fs.service';
import { DeletePublicFileUseCaseResponse } from './delete-public-file-use-case-response';
import { DeletePublicFileUseCaseRequest } from './delete-public-file-use-case-request';

export class DeleteFileUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly unitOfWork: UnitOfWork,
    private readonly fsService: FsService,
  ) {}

  async execute(
    request: DeletePublicFileUseCaseRequest,
  ): Promise<DeletePublicFileUseCaseResponse> {
    /*const { ownerId, fileId } = request;

    const user = await this.unitOfWork.getUserRepository().findById(ownerId);

    const publicFile = await this.unitOfWork
      .getPublicFileRepository()
      .findByIdAndOwner(user, fileId);

    if (!publicFile) {
      throw new NotFoundException(
        util.format(ErrorMessage.FILE_NOT_FOUND, fileId),
      );
    }

    await this.unitOfWork.getManager().transactional(async () => {
      await this.unitOfWork.getFileRepository().delete(file);
      await this.fsService.deleteFile(file.path);
      await this.unitOfWork.save();
    });

    return new DeleteFileUseCaseResponse();*/

    return null;
  }
}

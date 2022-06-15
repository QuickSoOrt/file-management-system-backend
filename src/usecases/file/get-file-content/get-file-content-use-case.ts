import { ILogger } from '../../../domain/logger/logger.interface';
import { UnitOfWork } from '../../../infrastructure/repositories/unit-of-work/unit-of-work';
import { GetFileContentUseCaseRequest } from './get-file-content-use-case-request';
import { GetFileContentUseCaseResponse } from './get-file-content-use-case-response';
import { NotFoundException } from '@nestjs/common';
import * as util from 'util';
import { ErrorMessage } from '../../../domain/error-messages/error-message';
import { FsService } from '../../../infrastructure/services/fs.service';

export class GetFileContentUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly unitOfWork: UnitOfWork,
    private readonly fsService: FsService,
  ) {}

  async execute(
    request: GetFileContentUseCaseRequest,
  ): Promise<GetFileContentUseCaseResponse> {
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

    const content = await this.fsService.readFile(
      file.IV,
      file.owner.id + file.path,
    );

    const getFileContentUseCaseResponse: GetFileContentUseCaseResponse =
      new GetFileContentUseCaseResponse(content);

    return getFileContentUseCaseResponse;
  }
}

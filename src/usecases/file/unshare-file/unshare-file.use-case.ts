import { ILogger } from '../../../domain/logger/logger.interface';
import { UnitOfWork } from '../../../infrastructure/repositories/unit-of-work/unit-of-work';
import { NotFoundException } from '@nestjs/common';
import * as util from 'util';
import { ErrorMessage } from '../../../domain/error-messages/error-message';
import FilePermission from '../../../infrastructure/entities/mikro-orm/file-permission';
import { UnshareFileUseCaseResponse } from './unshare-file-use-case-response';
import { UnshareFileUseCaseRequest } from './unshare-file-use-case-request';

export class UnshareFileUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async execute(
    request: UnshareFileUseCaseRequest,
  ): Promise<UnshareFileUseCaseResponse> {
    const { ownerId, fileId, usersToUnshareWith } = request;

    const owner = await this.unitOfWork.getUserRepository().findById(ownerId);

    if (!owner) {
      throw new NotFoundException(
        util.format(ErrorMessage.USER_NOT_FOUND, ownerId),
      );
    }

    const file = await this.unitOfWork
      .getFileRepository()
      .findByIdAndOwner(owner, fileId);

    if (!file) {
      throw new NotFoundException(
        util.format(ErrorMessage.FILE_NOT_FOUND, fileId),
      );
    }

    const permissions: FilePermission[] = [];

    for (let i = 0; i < usersToUnshareWith.length; i++) {
      const user = await this.unitOfWork
        .getUserRepository()
        .findById(usersToUnshareWith[i]);
      if (user) {
        const filePermission = await this.unitOfWork
          .getFilePermissionRepository()
          .findByUserAndFile(user, file);
        permissions.push(filePermission);
      }
    }

    await this.unitOfWork.getManager().transactional(async () => {
      await this.unitOfWork
        .getFilePermissionRepository()
        .deletePermissions(permissions);
      await this.unitOfWork.save();
    });

    const unshareFileUseCaseResponse: UnshareFileUseCaseResponse =
      new UnshareFileUseCaseResponse();

    return unshareFileUseCaseResponse;
  }
}

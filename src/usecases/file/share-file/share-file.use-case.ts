import { ILogger } from '../../../domain/logger/logger.interface';
import { UnitOfWork } from '../../../infrastructure/repositories/unit-of-work/unit-of-work';
import { ShareFileUseCaseRequest } from './share-file-use-case.request';
import { ShareFileUseCaseResponse } from './share-file-use-case-response';
import { NotFoundException } from '@nestjs/common';
import * as util from 'util';
import { ErrorMessage } from '../../../domain/error-messages/error-message';
import FilePermission from '../../../infrastructure/entities/mikro-orm/file-permission';
import { AccessTypeEnum } from '../../../infrastructure/entities/mikro-orm/access-type.enum';

export class ShareFileUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async execute(
    request: ShareFileUseCaseRequest,
  ): Promise<ShareFileUseCaseResponse> {
    const { ownerId, fileId, usersToShareWith } = request;

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

    for (let i = 0; i < usersToShareWith.length; i++) {
      if (usersToShareWith[i] != ownerId) {
        const user = await this.unitOfWork
          .getUserRepository()
          .findById(usersToShareWith[i]);
        if (user) {
          let filePermission = await this.unitOfWork
            .getFilePermissionRepository()
            .findByUserAndFile(user, file);
          if (!filePermission) {
            filePermission = new FilePermission();
            filePermission.user = user;
            filePermission.file = file;
            filePermission.accessType = AccessTypeEnum.READ_WRITE;
            permissions.push(filePermission);
          }
        }
      }
    }

    await this.unitOfWork.getManager().transactional(async () => {
      await this.unitOfWork
        .getFilePermissionRepository()
        .insertPermissions(permissions);
      await this.unitOfWork.save();
    });

    const shareFileUseCaseResponse: ShareFileUseCaseResponse =
      new ShareFileUseCaseResponse();

    return shareFileUseCaseResponse;
  }
}

import { ILogger } from '../../../domain/logger/logger.interface';
import { GetFoldersUseCaseRequest } from './get-folders-use-case-request';
import { GetFoldersUseCaseResponse } from './get-folders-use-case-response';
import { UnitOfWork } from '../../../infrastructure/repositories/unit-of-work/unit-of-work';
import { FolderMapper } from '../../../infrastructure/mappers/folder.mapper';
import { NotFoundException } from '@nestjs/common';
import * as util from 'util';
import { ErrorMessage } from '../../../domain/error-messages/error-message';

export class GetFoldersUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly unitOfWork: UnitOfWork,
    private readonly folderMapper: FolderMapper,
  ) {}

  async execute(
    request: GetFoldersUseCaseRequest,
  ): Promise<GetFoldersUseCaseResponse> {
    const { ownerId, parent } = request;

    const user = await this.unitOfWork.getUserRepository().findById(ownerId);
    if (!user) {
      throw new NotFoundException(
        util.format(ErrorMessage.USER_NOT_FOUND, ownerId),
      );
    }

    const folder = await this.unitOfWork
      .getFolderRepository()
      .findByIdAndOwner(user, parent);

    if (parent) {
      if (!folder) {
        throw new NotFoundException(
          util.format(ErrorMessage.FOLDER_NOT_FOUND, parent),
        );
      }
    }

    console.log('aaaa');

    const folders = await this.unitOfWork
      .getFolderRepository()
      .findChildreenFolders(user, folder);
    const response: GetFoldersUseCaseResponse = new GetFoldersUseCaseResponse();

    response.folders = folders.map((f) =>
      this.folderMapper.fromFolderToFolderModel(f),
    );

    return response;
  }
}

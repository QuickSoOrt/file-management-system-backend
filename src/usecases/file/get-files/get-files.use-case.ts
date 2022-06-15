import { ILogger } from '../../../domain/logger/logger.interface';
import { GetFilesUseCaseRequest } from './get-files-use-case-request';
import { GetFilesUseCaseResponse } from './get-files-use-case-response';
import { GetFoldersUseCaseResponse } from '../../folder/get-folders/get-folders-use-case-response';
import { UnitOfWork } from '../../../infrastructure/repositories/unit-of-work/unit-of-work';
import { FileMapper } from '../../../infrastructure/mappers/file.mapper';
import { NotFoundException } from '@nestjs/common';
import * as util from 'util';
import { ErrorMessage } from '../../../domain/error-messages/error-message';

export class GetFilesUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly unitOfWork: UnitOfWork,
    private readonly fileMapper: FileMapper,
  ) {}

  async execute(
    request: GetFilesUseCaseRequest,
  ): Promise<GetFilesUseCaseResponse> {
    const { ownerId, parentFolderId } = request;

    const user = await this.unitOfWork.getUserRepository().findById(ownerId);

    const folder = await this.unitOfWork
      .getFolderRepository()
      .findByIdAndOwner(user, parentFolderId);

    if (parentFolderId) {
      if (!folder) {
        throw new NotFoundException(
          util.format(ErrorMessage.FOLDER_NOT_FOUND, parentFolderId),
        );
      }
    }

    const files = await this.unitOfWork
      .getFileRepository()
      .findChildreenFiles(user, folder);

    files.forEach((f) => {
      console.log(f.permissions);
    });

    const response: GetFilesUseCaseResponse = new GetFilesUseCaseResponse();

    response.files = files.map((f) => this.fileMapper.fromFileToFileModel(f));

    return response;
  }
}

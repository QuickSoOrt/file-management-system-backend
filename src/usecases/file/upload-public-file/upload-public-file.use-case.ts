import { ILogger } from '../../../domain/logger/logger.interface';
import { ConflictException } from '@nestjs/common';
import { ErrorMessage } from '../../../domain/error-messages/error-message';
import * as util from 'util';
import { UnitOfWork } from '../../../infrastructure/repositories/unit-of-work/unit-of-work';
import { FsService } from '../../../infrastructure/services/fs.service';
import { FileMapper } from '../../../infrastructure/mappers/file.mapper';
import { UploadPublicFileUseCaseResponse } from './upload-public-file-use-case-response';
import { UploadPublicFileUseCaseRequest } from './upload-public-file-use-case-request';
import PublicFile from '../../../infrastructure/entities/mikro-orm/public-file';

export class UploadPublicFileUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly fsService: FsService,
    private readonly unitOfWork: UnitOfWork,
    private readonly fileMapper: FileMapper,
  ) {}

  async execute(
    request: UploadPublicFileUseCaseRequest,
  ): Promise<UploadPublicFileUseCaseResponse> {
    const { ownerId, name, size, content, mimetype } = request;

    const user = await this.unitOfWork
      .getUserRepository()
      .findOne({ id: ownerId });

    const publicFile = await this.unitOfWork
      .getPublicFileRepository()
      .findByUser(user);

    if (publicFile) {
      throw new ConflictException(
        util.format(ErrorMessage.FILE_ALREADY_EXISTS, name),
      );
    }

    const newPublicFile: PublicFile = new PublicFile();
    newPublicFile.name = name;
    newPublicFile.size = size;
    newPublicFile.mimetype = mimetype;
    newPublicFile.systemName = 'index.html';
    newPublicFile.path = '/' + newPublicFile.systemName;
    newPublicFile.owner = user;

    await this.unitOfWork.getManager().transactional(async () => {
      await this.unitOfWork.getFileRepository().persist(newPublicFile);
      await this.fsService.createPublicFile(
        user.username + newPublicFile.path,
        content,
      );
      await this.unitOfWork.save();
    });

    const response: UploadPublicFileUseCaseResponse =
      new UploadPublicFileUseCaseResponse();

    return response;
  }
}

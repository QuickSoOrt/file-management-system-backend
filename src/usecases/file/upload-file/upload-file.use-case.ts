import { ILogger } from '../../../domain/logger/logger.interface';
import { UploadFileUseCaseRequest } from './upload-file-use-case-request';
import { UploadFileUseCaseResponse } from './upload-file-use-case-response';
import { ConflictException } from '@nestjs/common';
import { ErrorMessage } from '../../../domain/error-messages/error-message';
import * as util from 'util';
import * as mime from 'mime-types';
import * as uuid from 'uuid';
import File from '../../../infrastructure/entities/mikro-orm/file.entity';
import { UnitOfWork } from '../../../infrastructure/repositories/unit-of-work/unit-of-work';
import { FsService } from '../../../infrastructure/services/fs.service';
import { FileMapper } from '../../../infrastructure/mappers/file.mapper';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

export class UploadFileUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly fsService: FsService,
    private readonly unitOfWork: UnitOfWork,
    private readonly fileMapper: FileMapper,
  ) {}

  async execute(
    request: UploadFileUseCaseRequest,
  ): Promise<UploadFileUseCaseResponse> {
    const { ownerId, parentFolderId, name, size, content, mimetype } = request;

    const user = await this.unitOfWork
      .getUserRepository()
      .findOne({ id: ownerId });

    const parentFolder = await this.unitOfWork
      .getFolderRepository()
      .findByIdAndOwner(user, parentFolderId);

    if (parentFolderId) {
      if (!parentFolder) {
        throw new ConflictException(
          util.format(ErrorMessage.FOLDER_NOT_FOUND, parentFolderId),
        );
      }
    }

    const file = await this.unitOfWork
      .getFileRepository()
      .findByName(user, parentFolder, name);

    if (file) {
      throw new ConflictException(
        util.format(ErrorMessage.FILE_ALREADY_EXISTS, name),
      );
    }

    const newFile: File = new File();
    newFile.name = name;
    newFile.size = size;
    newFile.mimetype = mimetype;
    newFile.IV = randomBytes(16);
    newFile.systemName = uuid.v4();
    newFile.path = parentFolder
      ? parentFolder.path +
        '/' +
        newFile.systemName +
        '.' +
        mime.extension(mimetype)
      : '/' + newFile.systemName + '.' + mime.extension(mimetype);
    newFile.owner = user;
    if (parentFolder) {
      newFile.folder = parentFolder;
    }

    await this.unitOfWork.getManager().transactional(async () => {
      await this.unitOfWork.getFileRepository().persist(newFile);
      await this.fsService.createFile(
        ownerId + newFile.path,
        newFile.IV,
        content,
      );
      await this.unitOfWork.save();
    });

    const response: UploadFileUseCaseResponse = new UploadFileUseCaseResponse(
      this.fileMapper.fromFileToFileModel(newFile),
    );

    return response;
  }
}

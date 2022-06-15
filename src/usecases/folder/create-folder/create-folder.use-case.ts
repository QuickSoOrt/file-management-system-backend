import { ConflictException, NotFoundException } from '@nestjs/common';
import { ILogger } from '../../../domain/logger/logger.interface';
import { CreateFolderUseCaseResponse } from './create-folder-use-case-response';
import { CreateFolderUseCaseRequest } from './create-folder-use-case-request';
import { ErrorMessage } from '../../../domain/error-messages/error-message';
import * as util from 'util';
import * as uuid from 'uuid';
import { UnitOfWork } from '../../../infrastructure/repositories/unit-of-work/unit-of-work';
import Folder from '../../../infrastructure/entities/mikro-orm/folder.entity';
import { FolderMapper } from '../../../infrastructure/mappers/folder.mapper';
import { FsService } from '../../../infrastructure/services/fs.service';

export class CreateFolderUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly unitOfWork: UnitOfWork,
    private readonly fsService: FsService,
    private readonly folderMapper: FolderMapper,
  ) {}

  async execute(
    request: CreateFolderUseCaseRequest,
  ): Promise<CreateFolderUseCaseResponse> {
    const { ownerId, folderName, parentFolderId } = request;
    const user = await this.unitOfWork.getUserRepository().findById(ownerId);
    if (!user) {
      throw new NotFoundException(
        util.format(ErrorMessage.USER_NOT_FOUND, ownerId),
      );
    }
    let parentFolder;
    if (parentFolderId) {
      parentFolder = await this.unitOfWork
        .getFolderRepository()
        .findByIdAndOwner(user, parentFolderId);
      if (!parentFolder) {
        throw new NotFoundException(
          util.format(ErrorMessage.PARENT_FOLDER_NOT_FOUND, parentFolderId),
        );
      }
    }
    const folder = await this.unitOfWork
      .getFolderRepository()
      .findByName(user, parentFolder, folderName);
    if (folder) {
      throw new ConflictException(
        util.format(ErrorMessage.FOLDER_ALREADY_EXISTS, folderName),
      );
    }
    const newFolder: Folder = new Folder();
    newFolder.name = folderName;
    newFolder.owner = user;
    newFolder.systemName = uuid.v4();
    newFolder.path = parentFolder
      ? parentFolder.path + '/' + newFolder.systemName
      : '/' + newFolder.systemName;
    if (parentFolder) {
      newFolder.parent = parentFolder;
    }
    await this.unitOfWork.getManager().transactional(async () => {
      await this.unitOfWork.getFolderRepository().persist(newFolder);
      await this.fsService.createFolder(user.id + newFolder.path);
      await this.unitOfWork.save();
    });
    const response: CreateFolderUseCaseResponse =
      new CreateFolderUseCaseResponse();
    response.folder = this.folderMapper.fromFolderToFolderModel(newFolder);
    return response;
  }
}

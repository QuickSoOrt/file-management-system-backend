import { ConflictException, NotFoundException } from '@nestjs/common';
import { ILogger } from '../../../domain/logger/logger.interface';
import { CreateSharedFolderUseCaseResponse } from './create-shared-folder-use-case-response';
import { CreateSharedFolderUseCaseRequest } from './create-shared-folder-use-case-request';
import { ErrorMessage } from '../../../domain/error-messages/error-message';
import * as util from 'util';
import * as uuid from 'uuid';
import { UnitOfWork } from '../../../infrastructure/repositories/unit-of-work/unit-of-work';
import Folder from '../../../infrastructure/entities/mikro-orm/folder.entity';
import { FolderMapper } from '../../../infrastructure/mappers/folder.mapper';
import { FsService } from '../../../infrastructure/services/fs.service';
import FolderPermission from '../../../infrastructure/entities/mikro-orm/folder-permission';
import { AccessTypeEnum } from '../../../infrastructure/entities/mikro-orm/access-type.enum';

export class CreateSharedFolderUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly unitOfWork: UnitOfWork,
    private readonly fsService: FsService,
    private readonly folderMapper: FolderMapper,
  ) {}

  async execute(
    request: CreateSharedFolderUseCaseRequest,
  ): Promise<CreateSharedFolderUseCaseResponse> {
    const { userId, folderName, parentFolderId } = request;

    console.log(parentFolderId);

    const user = await this.unitOfWork.getUserRepository().findById(userId);

    const parentFolder = await this.unitOfWork
      .getFolderRepository()
      .findById(parentFolderId);

    if (!parentFolder) {
      throw new NotFoundException(
        util.format(ErrorMessage.PARENT_FOLDER_NOT_FOUND, parentFolderId),
      );
    }

    const permission = await this.unitOfWork
      .getFolderPermissionRepository()
      .findByUserAndFolder(user, parentFolder);

    if (!permission) {
      throw new NotFoundException(
        ErrorMessage.INVALID_FOLDER_ACCESS_PERMISSION,
      );
    }

    const folderAux = await this.unitOfWork
      .getFolderRepository()
      .findByName(user, parentFolder, folderName);
    if (folderAux) {
      throw new ConflictException(
        util.format(ErrorMessage.FOLDER_ALREADY_EXISTS, folderName),
      );
    }

    const newFolder: Folder = new Folder();
    newFolder.name = folderName;
    newFolder.owner = parentFolder.owner;
    newFolder.systemName = uuid.v4();
    newFolder.path = parentFolder.path + '/' + newFolder.systemName;
    newFolder.parent = parentFolder;

    const parentFolderPermissions = await this.unitOfWork
      .getFolderPermissionRepository()
      .findFolderPermissions(parentFolder);

    const newPermissions = [];

    for (const folderPermissionAux of parentFolderPermissions) {
      const newPermission: FolderPermission = new FolderPermission();
      newPermission.user = folderPermissionAux.user;
      newPermission.folder = newFolder;
      newPermission.accessType = AccessTypeEnum.READ_WRITE;
      newPermissions.push(newPermission);
    }

    await this.unitOfWork.getManager().transactional(async () => {
      await this.unitOfWork.getFolderRepository().persist(newFolder);
      await this.unitOfWork
        .getFolderPermissionRepository()
        .insertPermissions(newPermissions);
      await this.fsService.createFolder(parentFolder.owner.id + newFolder.path);
      await this.unitOfWork.save();
    });

    const response: CreateSharedFolderUseCaseResponse =
      new CreateSharedFolderUseCaseResponse();
    response.folder = this.folderMapper.fromFolderToFolderModel(newFolder);
    return response;
  }
}

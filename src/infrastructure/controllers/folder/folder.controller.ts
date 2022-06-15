import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FolderMapper } from '../../mappers/folder.mapper';
import { UseCaseProxy } from '../../usecases-proxy/usecase-proxy';
import { FolderUseCasesProxyModule } from '../../usecases-proxy/folder-use-cases-proxy.module';
import { JwtAuthenticationGuard } from '../../authentication/guards/jwt-authentication.guard';
import IRequestWithUser from '../../../domain/authentication/request-with-user.interface';
import { CreateFolderUseCase } from '../../../usecases/folder/create-folder/create-folder.use-case';
import { CreateFolderUseCaseRequest } from '../../../usecases/folder/create-folder/create-folder-use-case-request';
import { CreateFolderRequestDto } from './dtos/create-folder-request.dto';
import { GetFoldersUseCase } from '../../../usecases/folder/get-folders/get-folders.use-case';
import { FolderPresenter } from '../../presenters/folder.presenter';
import { GetFoldersUseCaseRequest } from '../../../usecases/folder/get-folders/get-folders-use-case-request';
import { GetFoldersRequestDto } from './dtos/get-folders-request.dto';
import { RenameFolderRequestDto } from './dtos/rename-folder-request.dto';
import { RenameFolderUseCaseRequest } from '../../../usecases/folder/rename-folder/rename-folder-use-case-request';
import { RenameFolderUseCase } from '../../../usecases/folder/rename-folder/rename-folder.use-case';
import { DeleteFolderUseCaseRequest } from '../../../usecases/folder/delete-folder/delete-folder-use-case.request';
import { DeleteFolderUseCase } from '../../../usecases/folder/delete-folder/delete-folder.use-case';
import { MoveFoldersRequestDto } from './dtos/move-folder-request.dto';
import { MoveFolderUseCaseRequest } from '../../../usecases/folder/move-folder/move-folder-use-case-request';
import { MoveFolderUseCase } from '../../../usecases/folder/move-folder/move-folder-use-case';
import { ShareFolderRequestDto } from './dtos/share-folder-request.dto';
import { ShareFolderUseCaseRequest } from '../../../usecases/folder/share-folder/share-folder-use-case-request';
import { ShareFolderUseCase } from '../../../usecases/folder/share-folder/share-folder.use-case';
import { UnshareFolderRequestDto } from './dtos/unshare-folder-request.dto';
import { UnshareFolderUseCaseRequest } from '../../../usecases/folder/unshare-folder/unshare-folder-use-case.request';
import { UnshareFolderUseCase } from '../../../usecases/folder/unshare-folder/unshare-folder.use-case';
import { GetSharedFoldersRequestDto } from './dtos/get-shared-folders-request.dto';
import { GetSharedFoldersUseCaseRequest } from '../../../usecases/folder/get-shared-folders/get-shared-folders-use-case-request';
import { GetSharedFoldersUseCase } from '../../../usecases/folder/get-shared-folders/get-shared-folders.use-case';

@Controller('folders')
export class FolderController {
  constructor(
    @Inject(FolderMapper)
    private readonly folderMapper: FolderMapper,
    @Inject(FolderUseCasesProxyModule.CREATE_FOLDER_USECASE_PROXY)
    private readonly createFolderUseCaseProxy: UseCaseProxy<CreateFolderUseCase>,
    /*@Inject(FolderUseCasesProxyModule.UPLOAD_FOLDER_USECASE_PROXY)
    private readonly uploadFolderUseCaseProxy: UseCaseProxy<UploadFolderUseCase>,*/
    @Inject(FolderUseCasesProxyModule.GET_FOLDERS_USECASE_PROXY)
    private readonly getFoldersUseCaseProxy: UseCaseProxy<GetFoldersUseCase>,
    @Inject(FolderUseCasesProxyModule.RENAME_FOLDER_USECASE_PROXY)
    private readonly renameFolderUseCaseProxy: UseCaseProxy<RenameFolderUseCase>,
    @Inject(FolderUseCasesProxyModule.DELETE_FOLDER_USECASE_PROXY)
    private readonly deleteFolderUseCaseProxy: UseCaseProxy<DeleteFolderUseCase>,
    @Inject(FolderUseCasesProxyModule.MOVE_FOLDER_USECASE_PROXY)
    private readonly moveFolderUseCaseProxy: UseCaseProxy<MoveFolderUseCase>,
    @Inject(FolderUseCasesProxyModule.SHARE_FOLDER_USECASE_PROXY)
    private readonly shareFolderUseCaseProxy: UseCaseProxy<ShareFolderUseCase>,
    @Inject(FolderUseCasesProxyModule.UNSHARE_FOLDER_USECASE_PROXY)
    private readonly unshareFolderUseCaseProxy: UseCaseProxy<UnshareFolderUseCase>,
    @Inject(FolderUseCasesProxyModule.GET_SHARED_FOLDERS_USECASE_PROXY)
    private readonly getSharedFoldersUseCaseProxy: UseCaseProxy<GetSharedFoldersUseCase>,
  ) {}

  @UseGuards(JwtAuthenticationGuard)
  @Post('create')
  async createFolder(
    @Req() request: IRequestWithUser,
    @Body() createFolderRequestDto: CreateFolderRequestDto,
  ): Promise<FolderPresenter> {
    const { folderName, parentFolderId } = createFolderRequestDto;
    const user = request.user;

    const createFolderUseCaseRequest: CreateFolderUseCaseRequest =
      new CreateFolderUseCaseRequest(folderName, user.id, parentFolderId);

    const { folder } = await this.createFolderUseCaseProxy
      .getInstance()
      .execute(createFolderUseCaseRequest);

    return this.folderMapper.fromFolderModelToFolderPresenter(folder);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('upload')
  async uploadFolder() {}

  @UseGuards(JwtAuthenticationGuard)
  @Post('')
  async getFolders(
    @Req() request: IRequestWithUser,
    @Body() getFoldersRequestDto: GetFoldersRequestDto,
  ): Promise<FolderPresenter[]> {
    const user = request.user;
    const { parentFolderId } = getFoldersRequestDto;

    const getFoldersUseCaseRequest: GetFoldersUseCaseRequest =
      new GetFoldersUseCaseRequest();

    getFoldersUseCaseRequest.parent = parentFolderId;
    getFoldersUseCaseRequest.ownerId = user.id;

    const { folders } = await this.getFoldersUseCaseProxy
      .getInstance()
      .execute(getFoldersUseCaseRequest);

    return folders.map((f) =>
      this.folderMapper.fromFolderModelToFolderPresenter(f),
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch('/:id/name')
  async renameFolder(
    @Req() request: IRequestWithUser,
    @Param('id') folderId: string,
    @Body() renameFolderRequestDto: RenameFolderRequestDto,
  ): Promise<FolderPresenter> {
    const user = request.user;
    const { newName } = renameFolderRequestDto;

    const renameFolderUseCaseRequest: RenameFolderUseCaseRequest =
      new RenameFolderUseCaseRequest();

    renameFolderUseCaseRequest.ownerId = user.id;
    renameFolderUseCaseRequest.folderId = folderId;
    renameFolderUseCaseRequest.newName = newName;

    const { folder } = await this.renameFolderUseCaseProxy
      .getInstance()
      .execute(renameFolderUseCaseRequest);

    return this.folderMapper.fromFolderModelToFolderPresenter(folder);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete('/:id')
  async deleteFolder(
    @Req() request: IRequestWithUser,
    @Param('id') folderId: string,
  ): Promise<void> {
    const user = request.user;
    const deleteFolderUseCaseRequest: DeleteFolderUseCaseRequest =
      new DeleteFolderUseCaseRequest();

    deleteFolderUseCaseRequest.folderId = folderId;
    deleteFolderUseCaseRequest.ownerId = user.id;

    await this.deleteFolderUseCaseProxy
      .getInstance()
      .execute(deleteFolderUseCaseRequest);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch('/:id/move')
  async moveFolder(
    @Req() request: IRequestWithUser,
    @Param('id') folderId: string,
    @Body() moveFoldersRequestDto: MoveFoldersRequestDto,
  ): Promise<void> {
    const user = request.user;
    const { newParentFolderId } = moveFoldersRequestDto;
    const moveFolderUseCaseRequest: MoveFolderUseCaseRequest =
      new MoveFolderUseCaseRequest(user.id, folderId, newParentFolderId);

    await this.moveFolderUseCaseProxy
      .getInstance()
      .execute(moveFolderUseCaseRequest);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('/:id/share')
  async shareFile(
    @Req() request: IRequestWithUser,
    @Param('id') folderId: string,
    @Body() shareFolderRequestDto: ShareFolderRequestDto,
  ): Promise<void> {
    const user = request.user;
    const { usersToShareWith } = shareFolderRequestDto;
    const shareFolderUseCaseRequest: ShareFolderUseCaseRequest =
      new ShareFolderUseCaseRequest();

    shareFolderUseCaseRequest.ownerId = user.id;
    shareFolderUseCaseRequest.folderId = folderId;
    shareFolderUseCaseRequest.usersToShareWith = usersToShareWith;

    await this.shareFolderUseCaseProxy
      .getInstance()
      .execute(shareFolderUseCaseRequest);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('/:id/unshare')
  async unshareFile(
    @Req() request: IRequestWithUser,
    @Param('id') folderId: string,
    @Body() unshareFolderRequestDto: UnshareFolderRequestDto,
  ): Promise<void> {
    const user = request.user;
    const { usersToUnshareWith } = unshareFolderRequestDto;
    const unshareFolderUseCaseRequest: UnshareFolderUseCaseRequest =
      new UnshareFolderUseCaseRequest();

    unshareFolderUseCaseRequest.ownerId = user.id;
    unshareFolderUseCaseRequest.folderId = folderId;
    unshareFolderUseCaseRequest.usersToUnshareWith = usersToUnshareWith;

    await this.unshareFolderUseCaseProxy
      .getInstance()
      .execute(unshareFolderUseCaseRequest);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('/shared')
  async getSharedFolders(
    @Req() request: IRequestWithUser,
    @Body() getSharedFoldersRequestDto: GetSharedFoldersRequestDto,
  ): Promise<FolderPresenter[]> {
    const user = request.user;
    const { parentFolderId } = getSharedFoldersRequestDto;

    const getSharedFoldersUseCaseRequest: GetSharedFoldersUseCaseRequest =
      new GetSharedFoldersUseCaseRequest();

    getSharedFoldersUseCaseRequest.parentId = parentFolderId;
    getSharedFoldersUseCaseRequest.ownerId = user.id;

    const { folders } = await this.getSharedFoldersUseCaseProxy
      .getInstance()
      .execute(getSharedFoldersUseCaseRequest);

    return folders.map((f) =>
      this.folderMapper.fromFolderModelToFolderPresenter(f),
    );
  }
}

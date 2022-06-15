import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  Res,
  Response,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { UseCaseProxy } from '../../usecases-proxy/usecase-proxy';
import { FileMapper } from '../../mappers/file.mapper';
import { FileUseCasesProxyModule } from '../../usecases-proxy/file-use-cases-proxy.module';
import { UploadFileUseCase } from '../../../usecases/file/upload-file/upload-file.use-case';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileUseCaseRequest } from '../../../usecases/file/upload-file/upload-file-use-case-request';
import { JwtAuthenticationGuard } from '../../authentication/guards/jwt-authentication.guard';
import IRequestWithUser from '../../../domain/authentication/request-with-user.interface';
import { UploadFileRequestDto } from './dtos/upload-file-request.dto';
import { DeleteFileUseCaseRequest } from '../../../usecases/file/delete-file/delete-file-use-case-request';
import { DeleteFileUseCase } from '../../../usecases/file/delete-file/delete-file.use-case';
import { RenameFileRequestDto } from './dtos/rename-file-request.dto';
import { RenameFileUseCaseRequest } from '../../../usecases/file/rename-file/rename-file-use-case-request';
import { RenameFileUseCase } from '../../../usecases/file/rename-file/rename-file.use-case';
import { FilePresenter } from '../../presenters/file.presenter';
import { GetFilesUseCase } from '../../../usecases/file/get-files/get-files.use-case';
import { GetFilesRequestDto } from './dtos/get-files-request.dto';
import { GetFilesUseCaseRequest } from '../../../usecases/file/get-files/get-files-use-case-request';
import * as path from 'path';
import { extname } from 'path';
import { GetFileContentUseCase } from '../../../usecases/file/get-file-content/get-file-content-use-case';
import { GetFileContentUseCaseRequest } from '../../../usecases/file/get-file-content/get-file-content-use-case-request';
import { MoveFileUseCase } from '../../../usecases/file/move-file/move-file.use-case';
import { MoveFileRequestDto } from './dtos/move-file-request.dto';
import { MoveFileUseCaseRequest } from '../../../usecases/file/move-file/move-file-use-case.request';
import { ShareFileUseCaseRequest } from '../../../usecases/file/share-file/share-file-use-case.request';
import { ShareFileUseCase } from '../../../usecases/file/share-file/share-file.use-case';
import { ShareFileRequestDto } from './dtos/share-file-request.dto';
import { UnshareFileUseCaseRequest } from '../../../usecases/file/unshare-file/unshare-file-use-case-request';
import { UnshareFileRequestDto } from './dtos/unshare-file-request.dto';
import { UnshareFileUseCase } from '../../../usecases/file/unshare-file/unshare-file.use-case';
import { GetSharedFilesUseCaseRequest } from '../../../usecases/file/get-shared-files/get-shared-files-use-case.request';
import { GetSharedFilesUseCase } from '../../../usecases/file/get-shared-files/get-shared-files.use-case';
import { GetSharedFilesRequestDto } from './dtos/get-shared-files-request.dto';
import { DownloadFileUseCaseRequest } from '../../../usecases/file/download-file/download-file-use-case-request';
import { DownloadFileUseCase } from '../../../usecases/file/download-file/download-file-use-case';
import { UploadPublicFileUseCase } from '../../../usecases/file/upload-public-file/upload-public-file.use-case';
import { UploadPublicFileRequestDto } from './dtos/upload-public-file-request.dto';
import { UploadPublicFileUseCaseRequest } from '../../../usecases/file/upload-public-file/upload-public-file-use-case-request';

@Controller('files')
export class FileController {
  constructor(
    @Inject(FileMapper)
    private readonly fileMapper: FileMapper,
    @Inject(FileUseCasesProxyModule.UPLOAD_FILE_USECASE_PROXY)
    private readonly uploadFileUseCaseProxy: UseCaseProxy<UploadFileUseCase>,
    @Inject(FileUseCasesProxyModule.UPLOAD_PUBLIC_FILE_USECASE_PROXY)
    private readonly uploadPublicFileUseCaseProxy: UseCaseProxy<UploadPublicFileUseCase>,
    @Inject(FileUseCasesProxyModule.DELETE_FILE_USECASE_PROXY)
    private readonly deleteFileUseCaseProxy: UseCaseProxy<DeleteFileUseCase>,
    @Inject(FileUseCasesProxyModule.RENAME_FILE_USECASE_PROXY)
    private readonly renameFileUseCaseProxy: UseCaseProxy<RenameFileUseCase>,
    @Inject(FileUseCasesProxyModule.GET_FILES_USECASE_PROXY)
    private readonly getFilesUseCaseProxy: UseCaseProxy<GetFilesUseCase>,
    @Inject(FileUseCasesProxyModule.GET_FILE_CONTENT_USECASE_PROXY)
    private readonly getFileContentUseCaseProxy: UseCaseProxy<GetFileContentUseCase>,
    @Inject(FileUseCasesProxyModule.MOVE_FILE_USECASE_PROXY)
    private readonly moveFileUseCaseUseCaseProxy: UseCaseProxy<MoveFileUseCase>,
    @Inject(FileUseCasesProxyModule.SHARE_FILE_USECASE_PROXY)
    private readonly shareFileUseCaseUseCaseProxy: UseCaseProxy<ShareFileUseCase>,
    @Inject(FileUseCasesProxyModule.UNSHARE_FILE_USECASE_PROXY)
    private readonly unshareFileUseCaseUseCaseProxy: UseCaseProxy<UnshareFileUseCase>,
    @Inject(FileUseCasesProxyModule.GET_SHARED_FILES_USECASE_PROXY)
    private readonly getSharedFilesUseCaseProxy: UseCaseProxy<GetSharedFilesUseCase>,
    @Inject(FileUseCasesProxyModule.DOWNLOAD_FILE_USECASE_PROXY)
    private readonly downloadFileUseCaseProxy: UseCaseProxy<DownloadFileUseCase>,
  ) {}

  @UseGuards(JwtAuthenticationGuard)
  @Post('public/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: Math.pow(1024, 2),
      },
      fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype.match('text/html')) {
          cb(null, true);
        } else {
          cb(
            new HttpException(
              `Unsupported file type ${extname(file.originalname)}`,
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
      },
    }),
  )
  async uploadPublicFile(
    @Req() request: IRequestWithUser,
    @Body() uploadPublicFileRequestDto: UploadPublicFileRequestDto,
    @UploadedFile() uploadedPublicFile: Express.Multer.File,
  ): Promise<void> {
    const user = request.user;
    const { originalname, buffer, mimetype, size } = uploadedPublicFile;

    const uploadPublicFileUseCaseRequest: UploadPublicFileUseCaseRequest =
      new UploadPublicFileUseCaseRequest(
        user.id,
        path.parse(originalname).name,
        size,
        buffer,
        mimetype,
      );

    await this.uploadPublicFileUseCaseProxy
      .getInstance()
      .execute(uploadPublicFileUseCaseRequest);

    return null;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete('public/:id')
  async deletePublicFile(
    @Req() request: IRequestWithUser,
    @Param('id') fileId: string,
  ): Promise<void> {
    return null;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: Math.pow(1024, 2),
      },
      fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype.match('text.*|image.*')) {
          cb(null, true);
        } else {
          cb(
            new HttpException(
              `Unsupported file type ${extname(file.originalname)}`,
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
      },
    }),
  )
  async uploadFile(
    @Req() request: IRequestWithUser,
    @Body() uploadFileRequestDto: UploadFileRequestDto,
    @UploadedFile() uploadedFile: Express.Multer.File,
  ): Promise<FilePresenter> {
    const user = request.user;
    const { originalname, buffer, mimetype, size } = uploadedFile;
    const { parentFolderId } = uploadFileRequestDto;

    const uploadFileUseCaseRequest: UploadFileUseCaseRequest =
      new UploadFileUseCaseRequest(
        user.id,
        parentFolderId,
        path.parse(originalname).name,
        size,
        buffer,
        mimetype,
      );

    const { file } = await this.uploadFileUseCaseProxy
      .getInstance()
      .execute(uploadFileUseCaseRequest);

    return this.fileMapper.fromFileModelToFilePresenter(file);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete('/:id')
  async deleteFile(
    @Req() request: IRequestWithUser,
    @Param('id') fileId: string,
  ): Promise<void> {
    const user = request.user;
    const deleteFileUseCaseRequest: DeleteFileUseCaseRequest =
      new DeleteFileUseCaseRequest();

    deleteFileUseCaseRequest.fileId = fileId;
    deleteFileUseCaseRequest.ownerId = user.id;
    await this.deleteFileUseCaseProxy
      .getInstance()
      .execute(deleteFileUseCaseRequest);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch('/:id/name')
  async renameFile(
    @Req() request: IRequestWithUser,
    @Param('id') fileId: string,
    @Body() renameFileRequestDto: RenameFileRequestDto,
  ): Promise<FilePresenter> {
    const user = request.user;
    const { newName } = renameFileRequestDto;

    const renameFileUseCaseRequest: RenameFileUseCaseRequest =
      new RenameFileUseCaseRequest();

    renameFileUseCaseRequest.ownerId = user.id;
    renameFileUseCaseRequest.fileId = fileId;
    renameFileUseCaseRequest.newName = newName;

    const { file } = await this.renameFileUseCaseProxy
      .getInstance()
      .execute(renameFileUseCaseRequest);

    return this.fileMapper.fromFileModelToFilePresenter(file);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('')
  async getFiles(
    @Req() request: IRequestWithUser,
    @Body() getFilesRequestDto: GetFilesRequestDto,
  ): Promise<FilePresenter[]> {
    const user = request.user;
    const { parentFolderId } = getFilesRequestDto;

    const getFilesUseCaseRequest: GetFilesUseCaseRequest =
      new GetFilesUseCaseRequest();

    getFilesUseCaseRequest.parentFolderId = parentFolderId;
    getFilesUseCaseRequest.ownerId = user.id;

    const { files } = await this.getFilesUseCaseProxy
      .getInstance()
      .execute(getFilesUseCaseRequest);

    return files.map((f) => this.fileMapper.fromFileModelToFilePresenter(f));
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('/:id/content')
  async getFileContent(
    @Req() request: IRequestWithUser,
    @Param('id') fileId: string,
  ): Promise<Buffer> {
    const user = request.user;
    const getFileContentRequest: GetFileContentUseCaseRequest =
      new GetFileContentUseCaseRequest();

    getFileContentRequest.fileId = fileId;
    getFileContentRequest.ownerId = user.id;

    const { content } = await this.getFileContentUseCaseProxy
      .getInstance()
      .execute(getFileContentRequest);

    return content;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch('/:id/move')
  async moveFile(
    @Req() request: IRequestWithUser,
    @Param('id') fileId: string,
    @Body() moveFileRequestDto: MoveFileRequestDto,
  ): Promise<void> {
    const user = request.user;
    const { newParentFolderId } = moveFileRequestDto;
    const moveFileUseCaseRequest: MoveFileUseCaseRequest =
      new MoveFileUseCaseRequest(user.id, fileId, newParentFolderId);

    await this.moveFileUseCaseUseCaseProxy
      .getInstance()
      .execute(moveFileUseCaseRequest);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('/:id/share')
  async shareFile(
    @Req() request: IRequestWithUser,
    @Param('id') fileId: string,
    @Body() shareFileRequestDto: ShareFileRequestDto,
  ): Promise<void> {
    const user = request.user;
    const { usersToShareWith } = shareFileRequestDto;
    const shareFileUseCaseRequest: ShareFileUseCaseRequest =
      new ShareFileUseCaseRequest();

    shareFileUseCaseRequest.ownerId = user.id;
    shareFileUseCaseRequest.fileId = fileId;
    shareFileUseCaseRequest.usersToShareWith = usersToShareWith;

    await this.shareFileUseCaseUseCaseProxy
      .getInstance()
      .execute(shareFileUseCaseRequest);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('/:id/unshare')
  async unshareFile(
    @Req() request: IRequestWithUser,
    @Param('id') fileId: string,
    @Body() unshareFileRequestDto: UnshareFileRequestDto,
  ): Promise<void> {
    const user = request.user;
    const { usersToUnshareWith } = unshareFileRequestDto;
    const unshareFileUseCaseRequest: UnshareFileUseCaseRequest =
      new UnshareFileUseCaseRequest();

    unshareFileUseCaseRequest.ownerId = user.id;
    unshareFileUseCaseRequest.fileId = fileId;
    unshareFileUseCaseRequest.usersToUnshareWith = usersToUnshareWith;

    await this.unshareFileUseCaseUseCaseProxy
      .getInstance()
      .execute(unshareFileUseCaseRequest);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('shared')
  async getSharedFiles(
    @Req() request: IRequestWithUser,
    @Body() getSharedFilesRequestDto: GetSharedFilesRequestDto,
  ): Promise<FilePresenter[]> {
    const user = request.user;
    const { parentFolderId } = getSharedFilesRequestDto;

    const getSharedFilesUseCaseRequest: GetSharedFilesUseCaseRequest =
      new GetSharedFilesUseCaseRequest();

    getSharedFilesUseCaseRequest.parentFolderId = parentFolderId;
    getSharedFilesUseCaseRequest.ownerId = user.id;

    const { files } = await this.getSharedFilesUseCaseProxy
      .getInstance()
      .execute(getSharedFilesUseCaseRequest);

    return files.map((f) => this.fileMapper.fromFileModelToFilePresenter(f));
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('/:id/download')
  async downloadFile(
    @Response({ passthrough: true }) res,
    @Req() request: IRequestWithUser,
    @Param('id') fileId: string,
  ): Promise<StreamableFile> {
    const user = request.user;
    const downloadFileRequest: DownloadFileUseCaseRequest =
      new DownloadFileUseCaseRequest();

    downloadFileRequest.fileId = fileId;
    downloadFileRequest.ownerId = user.id;

    const { file, fileContent } = await this.downloadFileUseCaseProxy
      .getInstance()
      .execute(downloadFileRequest);

    res.set({
      'Content-Disposition': `attachment; filename="${file.name}"`,
    });

    return new StreamableFile(fileContent);
  }
}

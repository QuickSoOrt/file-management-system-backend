import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IFileSystemConfigInterface } from '../../../../domain/config/file-system-config.interface';

@Injectable()
export class FileSystemEnvironmentConfigService
  implements IFileSystemConfigInterface
{
  constructor(private configService: ConfigService) {}

  getUploadedFilesPrivateLocation(): string {
    return this.configService.get<string>('UPLOAD_FILES_PRIVATE_LOCATION');
  }

  getUploadedFilesPublicLocation(): string {
    return this.configService.get<string>('UPLOAD_FILES_PUBLIC_LOCATION');
  }

  getFileEncryptionKey(): string {
    return this.configService.get<string>('FILE_ENCRYPTION_KEY');
  }
}

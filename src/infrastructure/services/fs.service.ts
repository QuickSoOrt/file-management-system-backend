import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotImplementedException,
  StreamableFile,
} from '@nestjs/common';
import { IFsService } from '../../domain/services/fs-service.interface';
import { FileSystemEnvironmentConfigService } from '../config/environment-config/file-system/file-system-environment-config.service';
import * as fs from 'node:fs/promises';
import * as fse from 'fs-extra';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { Binary } from 'mongodb';

@Injectable()
export class FsService implements IFsService {
  constructor(
    private readonly fileSystemEnvironmentConfigService: FileSystemEnvironmentConfigService,
  ) {}

  async createPublicFolder(path: string): Promise<void> {
    try {
      await fs.mkdir(
        this.fileSystemEnvironmentConfigService.getUploadedFilesPublicLocation() +
          path,
      );
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async createFolder(path: string): Promise<void> {
    try {
      await fs.mkdir(
        this.fileSystemEnvironmentConfigService.getUploadedFilesPrivateLocation() +
          path,
      );
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async renameFolder(oldPath: string, newPath: string): Promise<void> {
    try {
      await fs.rename(
        this.fileSystemEnvironmentConfigService.getUploadedFilesPrivateLocation() +
          oldPath,
        this.fileSystemEnvironmentConfigService.getUploadedFilesPrivateLocation() +
          newPath,
      );
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async deleteFolder(path: string): Promise<void> {
    try {
      await fs.rmdir(
        this.fileSystemEnvironmentConfigService.getUploadedFilesPrivateLocation() +
          path,
        { recursive: true },
      );
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async moveFolder(oldPath: string, newPath: string): Promise<void> {
    try {
      await fse.move(
        this.fileSystemEnvironmentConfigService.getUploadedFilesPrivateLocation() +
          oldPath,
        this.fileSystemEnvironmentConfigService.getUploadedFilesPrivateLocation() +
          newPath,
      );
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async createPublicFile(path: string, content: Buffer): Promise<void> {
    try {
      await fs.writeFile(
        this.fileSystemEnvironmentConfigService.getUploadedFilesPublicLocation() +
          path,
        content,
      );
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async createFile(path: string, IV: Binary, content: Buffer): Promise<void> {
    try {
      const key = (await promisify(scrypt)(
        this.fileSystemEnvironmentConfigService.getFileEncryptionKey(),
        'salt',
        32,
      )) as Buffer;

      const cipher = createCipheriv('aes-256-ctr', key, IV.buffer as Buffer);

      const encryptedContent = Buffer.concat([
        cipher.update(content),
        cipher.final(),
      ]);

      await fs.writeFile(
        `${this.fileSystemEnvironmentConfigService.getUploadedFilesPrivateLocation()}` +
          path,
        encryptedContent,
      );
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async deleteFile(path: string): Promise<void> {
    try {
      await fs.unlink(
        `${this.fileSystemEnvironmentConfigService.getUploadedFilesPrivateLocation()}` +
          path,
      );
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async renameFile(oldPath: string, newPath: string): Promise<void> {
    try {
      await fs.rename(
        this.fileSystemEnvironmentConfigService.getUploadedFilesPrivateLocation() +
          oldPath,
        this.fileSystemEnvironmentConfigService.getUploadedFilesPrivateLocation() +
          newPath,
      );
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async readFile(IV: Binary, path: string): Promise<Buffer> {
    try {
      const file = await fs.readFile(
        this.fileSystemEnvironmentConfigService.getUploadedFilesPrivateLocation() +
          path,
      );

      const key = (await promisify(scrypt)(
        this.fileSystemEnvironmentConfigService.getFileEncryptionKey(),
        'salt',
        32,
      )) as Buffer;

      const decipher = createDecipheriv(
        'aes-256-ctr',
        key,
        IV.buffer as Buffer,
      );
      const decryptedFile = Buffer.concat([
        decipher.update(file),
        decipher.final(),
      ]);

      return decryptedFile;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}

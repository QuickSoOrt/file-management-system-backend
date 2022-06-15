import { UserModel } from '../../domain/models/user.model';
import { ILogger } from '../../domain/logger/logger.interface';
import { ConflictException, NotImplementedException } from '@nestjs/common';
import { FolderRepository } from '../../infrastructure/repositories/type-orm/folder.repository';

export class UploadFolderUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly folderRepository: FolderRepository,
  ) {}

  async execute(email: string, password: string): Promise<UserModel> {
    throw new NotImplementedException();
  }
}

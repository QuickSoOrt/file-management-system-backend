import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';
import { ILogger } from '../../../domain/logger/logger.interface';
import { UserModel } from '../../../domain/models/user.model';
import { ErrorMessage } from '../../../domain/error-messages/error-message';
import { UnitOfWork } from '../../../infrastructure/repositories/unit-of-work/unit-of-work';
import { UserMapper } from '../../../infrastructure/mappers/user.mapper';
import User from '../../../infrastructure/entities/mikro-orm/user.entity';
import { FsService } from '../../../infrastructure/services/fs.service';
import { ObjectId } from '@mikro-orm/mongodb';

export class SignUpUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly unitOfWork: UnitOfWork,
    private readonly userMapper: UserMapper,
    private readonly fsService: FsService,
  ) {}

  async execute(
    email: string,
    username: string,
    password: string,
  ): Promise<UserModel> {
    let user = await this.unitOfWork.getUserRepository().findByEmail(email);

    if (user) {
      throw new ConflictException(ErrorMessage.USER_ALREADY_REGISTERED);
    }

    user = await this.unitOfWork.getUserRepository().findByUsername(username);

    if (user) {
      throw new ConflictException(ErrorMessage.USERNAME_ALREADY_TAKEN);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = new User();

    newUser._id = new ObjectId();
    newUser.email = email;
    newUser.username = username;
    newUser.password = hashedPassword;

    await this.unitOfWork.getManager().transactional(async () => {
      await this.unitOfWork.getUserRepository().insert(newUser);
      await this.fsService.createFolder(newUser.id);
      await this.fsService.createPublicFolder(newUser.username);
      await this.unitOfWork.save();
    });

    return this.userMapper.fromUserToUserModel(newUser);
  }
}

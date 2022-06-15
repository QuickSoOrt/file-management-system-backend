import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID, Repository, Connection } from 'typeorm';
import { IUserRepository } from '../../../domain/repositories/user-repository.interface';
import { UserModel } from '../../../domain/models/user.model';
import User from '../../entities/type-orm/user.entity';
import { UserMapper } from '../../mappers/user.mapper';
import * as fs from 'node:fs/promises';
import { FileSystemEnvironmentConfigService } from '../../config/environment-config/file-system/file-system-environment-config.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(UserMapper)
    private readonly userMapper: UserMapper,
    @Inject(FileSystemEnvironmentConfigService)
    private readonly fileSystemEnvironmentConfigService: FileSystemEnvironmentConfigService,
    @Inject(Connection)
    private readonly connection: Connection,
  ) {}

  async insert(userModel: UserModel): Promise<UserModel> {
    /*const newUser = this.userMapper.fromUserModelToUser(userModel);

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let result = null;

    try {
      result = await queryRunner.manager.save(newUser);
      await fs.mkdir(
        `${this.fileSystemEnvironmentConfigService.getUploadedFilesLocation()}` +
          '/' +
          result._id,
      );
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return this.userMapper.fromUserToUserModel(result);*/

    throw new NotImplementedException();
  }

  async findAll(): Promise<UserModel[]> {
    throw new NotImplementedException();
  }

  async findByEmail(email: string): Promise<UserModel> {
    /*const result = await this.userRepository.findOne({ email });

    if (result) {
      return this.userMapper.fromUserToUserModel(result);
    }

    return null;*/

    throw new NotImplementedException();
  }

  async findById(_id: ObjectID): Promise<UserModel> {
    /*const result = await this.userRepository.findOne({ _id });

    if (result) {
      return this.userMapper.fromUserToUserModel(result);
    }

    return null;*/

    throw new NotImplementedException();
  }
}

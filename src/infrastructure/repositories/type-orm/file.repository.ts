import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectID } from 'mongodb';
import { FileModel } from '../../../domain/models/file.model';
import { FileMapper } from '../../mappers/file.mapper';
import File from '../../entities/type-orm/file.entity';
import { IFileRepository } from '../../../domain/repositories/file-repository.interface';

@Injectable()
export class FileRepository implements IFileRepository {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @Inject(FileMapper)
    private readonly fileMapper: FileMapper,
  ) {}

  /*async insert(fileModel: FileModel): Promise<FileModel> {
    const newFile = this.fileMapper.fromFileModelToFile(fileModel);
    const result = await this.fileRepository.create(newFile);
    await this.fileRepository.save(result);
    return this.fileMapper.fromFileToFileModel(result);
  }

  async findAll(): Promise<FileModel[]> {
    throw new NotImplementedException();
  }

  async findById(_id: ObjectID): Promise<FileModel> {
    const file = await this.fileRepository.findOne({ _id });

    return this.fileMapper.fromFileToFileModel(file);
  }

  async findByName(name: string): Promise<FileModel> {
    const file = await this.fileRepository.findOne({ name });

    return this.fileMapper.fromFileToFileModel(file);
  }

  async updateFile(fileModel: FileModel): Promise<FileModel> {
    const { _id } = fileModel;

    const file = await this.fileRepository.findOne({ _id });

    if (file) {
      file.name = fileModel.name;
      await this.fileRepository.save(file);
    }

    return this.fileMapper.fromFileToFileModel(file);
  }

  async deleteFile(_id: ObjectID): Promise<void> {
    const a = await this.fileRepository.delete(_id);
  }*/
}

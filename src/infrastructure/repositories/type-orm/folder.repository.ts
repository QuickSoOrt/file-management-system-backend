import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection, getManager } from 'typeorm';
import { ObjectID } from 'mongodb';
import { IFolderRepository } from '../../../domain/repositories/folder-repository.interface';
import Folder from '../../entities/type-orm/folder.entity';
import { FolderModel } from '../../../domain/models/folder.model';
import { FolderMapper } from '../../mappers/folder.mapper';

@Injectable()
export class FolderRepository implements IFolderRepository {
  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
    @Inject(FolderMapper)
    private readonly folderMapper: FolderMapper,
  ) {}

  findAll(): Promise<FolderModel[]> {
    return Promise.resolve([]);
  }

  findById(_id): Promise<FolderModel> {
    return Promise.resolve(undefined);
  }

  insert(folderModel: FolderModel): Promise<FolderModel> {
    return Promise.resolve(undefined);
  }

  /*async insert(folderModel: FolderModel): Promise<FolderModel> {
    const newFolder = this.folderMapper.fromFolderModelToFolder(folderModel);
    const result = await this.folderRepository.create(newFolder);
    await this.folderRepository.save(result);
    return this.folderMapper.fromFolderToFolderModel(result);
  }

  async findAll(): Promise<FolderModel[]> {
    throw new NotImplementedException();
  }

  async find(ownerId: ObjectID, parent: ObjectID): Promise<FolderModel[]> {
    const folders = await this.folderRepository.find({
      where: { ownerId, parent },
    });
    return folders.map(this.folderMapper.fromFolderToFolderModel);
  }

  async findByName(
    ownerId: ObjectID,
    parent: ObjectID,
    name: string,
  ): Promise<FolderModel> {
    const folder = await this.folderRepository.findOne({
      where: { ownerId, parent, name },
    });

    return this.folderMapper.fromFolderToFolderModel(folder);
  }

  async findFolderPath(folderId: ObjectID): Promise<string> {
    let path = '';
    let folder = null;
    let _id = folderId;

    folder = await this.folderRepository.findOne({ where: { _id } });

    while (folder) {
      path = '/' + folder.name + path;
      _id = folder.parent;
      folder = await this.folderRepository.findOne({ where: { _id } });
    }

    return path;
  }

  async findById(_id: ObjectID): Promise<FolderModel> {
    const folder = await this.folderRepository.findOne({ where: { _id } });
    return this.folderMapper.fromFolderToFolderModel(folder);
  }

  async updateFolder(folderModel: FolderModel): Promise<FolderModel> {
    const { id } = folderModel;

    const folder = await this.folderRepository.findOne({ _id });

    if (folder) {
      folder.name = folderModel.name;
      await this.folderRepository.save(folder);
    }

    return this.folderMapper.fromFolderToFolderModel(folder);
  }

  async deleteFolder(_id: ObjectID): Promise<void> {
    await this.folderRepository.delete(_id);
  }*/
}

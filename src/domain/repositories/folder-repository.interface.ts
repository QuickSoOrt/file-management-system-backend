import { ObjectID } from 'mongodb';
import { FolderModel } from '../models/folder.model';

export interface IFolderRepository {
  insert(folderModel: FolderModel): Promise<FolderModel>;

  findAll(): Promise<FolderModel[]>;

  findById(_id: ObjectID): Promise<FolderModel>;
}

import { FolderModel } from '../../../domain/models/folder.model';

export class MoveFolderUseCaseResponse {
  folder: FolderModel;

  constructor(folder: FolderModel) {
    this.folder = folder;
  }
}

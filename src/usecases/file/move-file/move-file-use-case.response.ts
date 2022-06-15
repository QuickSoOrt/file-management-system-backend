import { FileModel } from '../../../domain/models/file.model';

export class MoveFileUseCaseResponse {
  file: FileModel;

  constructor(file: FileModel) {
    this.file = file;
  }
}

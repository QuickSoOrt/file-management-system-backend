import { FileModel } from '../../../domain/models/file.model';

export class UploadFileUseCaseResponse {
  file: FileModel;

  constructor(file: FileModel) {
    this.file = file;
  }
}

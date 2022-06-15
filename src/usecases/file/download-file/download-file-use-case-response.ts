import { FileModel } from '../../../domain/models/file.model';

export class DownloadFileUseCaseResponse {
  file: FileModel;
  fileContent: Buffer;

  constructor(file: FileModel, fileContent: Buffer) {
    this.file = file;
    this.fileContent = fileContent;
  }
}

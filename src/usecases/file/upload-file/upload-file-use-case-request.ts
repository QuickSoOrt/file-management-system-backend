export class UploadFileUseCaseRequest {
  ownerId: string;
  parentFolderId: string;
  name: string;
  size: number;
  content: Buffer;
  mimetype: string;

  constructor(
    ownerId: string,
    parentFolderId: string,
    name: string,
    size: number,
    content: Buffer,
    mimetype: string,
  ) {
    this.ownerId = ownerId;
    this.parentFolderId = parentFolderId;
    this.name = name;
    this.size = size;
    this.content = content;
    this.mimetype = mimetype;
  }
}

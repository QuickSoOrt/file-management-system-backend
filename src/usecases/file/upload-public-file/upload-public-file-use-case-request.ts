export class UploadPublicFileUseCaseRequest {
  ownerId: string;
  name: string;
  size: number;
  content: Buffer;
  mimetype: string;

  constructor(
    ownerId: string,
    name: string,
    size: number,
    content: Buffer,
    mimetype: string,
  ) {
    this.ownerId = ownerId;
    this.name = name;
    this.size = size;
    this.content = content;
    this.mimetype = mimetype;
  }
}

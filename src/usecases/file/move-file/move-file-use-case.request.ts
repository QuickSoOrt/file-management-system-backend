export class MoveFileUseCaseRequest {
  ownerId: string;
  fileId: string;
  newParentFolderId: string;

  constructor(ownerId: string, fileId: string, newParentFolderId: string) {
    this.ownerId = ownerId;
    this.fileId = fileId;
    this.newParentFolderId = newParentFolderId;
  }
}

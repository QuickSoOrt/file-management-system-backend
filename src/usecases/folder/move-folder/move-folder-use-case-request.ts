export class MoveFolderUseCaseRequest {
  ownerId: string;
  folderId: string;
  newParentFolderId: string;

  constructor(ownerId: string, folderId: string, newParentFolderId: string) {
    this.ownerId = ownerId;
    this.folderId = folderId;
    this.newParentFolderId = newParentFolderId;
  }
}

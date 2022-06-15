export class CreateFolderUseCaseRequest {
  folderName: string;

  ownerId: string;

  parentFolderId: string;

  constructor(folderName: string, ownerId: string, parentFolderId: string) {
    this.folderName = folderName;
    this.ownerId = ownerId;
    this.parentFolderId = parentFolderId;
  }
}

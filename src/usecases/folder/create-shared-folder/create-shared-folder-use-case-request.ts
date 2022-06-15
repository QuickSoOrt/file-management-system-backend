export class CreateSharedFolderUseCaseRequest {
  folderName: string;

  userId: string;

  parentFolderId: string;

  constructor(folderName: string, userId: string, parentFolderId: string) {
    this.folderName = folderName;
    this.userId = userId;
    this.parentFolderId = parentFolderId;
  }
}

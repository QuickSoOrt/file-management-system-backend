export class UnshareFileUseCaseRequest {
  ownerId: string;
  fileId: string;
  usersToUnshareWith: string[];
}

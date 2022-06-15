import { UserModel } from "./user.model";

export class FolderModel {
  id: string;

  ownerId: string;

  parentId: string;

  name: string;

  sharedWith: UserModel[];
}

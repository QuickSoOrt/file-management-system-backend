import { UserModel } from './user.model';

export class FileModel {
  public id: string;

  public folderId: string;

  public ownerId: string;

  public name: string;

  public mimetype: string;

  public size: number;

  public sharedWith: UserModel[];

  public createdAt: Date;

  public updatedAt: Date;
}

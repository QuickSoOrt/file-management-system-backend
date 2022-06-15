import { FolderModel } from '../../domain/models/folder.model';
import Folder from '../entities/mikro-orm/folder.entity';
import { FolderPresenter } from '../presenters/folder.presenter';
import { UserModel } from "../../domain/models/user.model";
import { UserPresenter } from "../presenters/user.presenter";

export class FolderMapper {
  fromFolderModelToFolder(folderModel: FolderModel): Folder {
    if (folderModel) {
      const folder: Folder = new Folder();
      folder.id = folderModel.id;
      folder.name = folderModel.name;
      return folder;
    }
    return null;
  }

  fromFolderToFolderModel(folder: Folder): FolderModel {
    if (folder) {
      const folderModel: FolderModel = new FolderModel();
      folderModel.id = folder.id;
      folderModel.name = folder.name;
      if (folder.permissions != null) {
        folderModel.sharedWith = [];
        for (const permission of folder.permissions) {
          if (permission.user) {
            const userModel: UserModel = new UserModel();
            userModel.id = permission.user.id;
            userModel.email = permission.user.email;
            folderModel.sharedWith.push(userModel);
          }
        }
      }
      return folderModel;
    }
    return null;
  }

  fromFolderModelToFolderPresenter(folderModel: FolderModel): FolderPresenter {
    if (folderModel) {
      const folderPresenter: FolderPresenter = new FolderPresenter();
      folderPresenter.id = folderModel.id;
      folderPresenter.name = folderModel.name;
      if (folderModel.sharedWith) {
        folderPresenter.sharedWith = [];
        for (const user of folderModel.sharedWith) {
          const userPresenter: UserPresenter = new UserPresenter();
          userPresenter.id = user.id;
          userPresenter.email = user.email;
          folderPresenter.sharedWith.push(userPresenter);
        }
      }
      return folderPresenter;
    }
    return null;
  }
}

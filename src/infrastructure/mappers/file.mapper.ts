import { FileModel } from '../../domain/models/file.model';
import File from '../entities/mikro-orm/file.entity';
import { FilePresenter } from '../presenters/file.presenter';
import { UserModel } from '../../domain/models/user.model';
import { UserPresenter } from '../presenters/user.presenter';

export class FileMapper {
  fromFileModelToFile(fileModel: FileModel): File {
    if (fileModel) {
      const file: File = new File();
      file.id = fileModel.id;
      file.name = fileModel.name;
      file.size = fileModel.size;
      file.mimetype = fileModel.mimetype;
      file.createdAt = fileModel.createdAt;
      file.updatedAt = fileModel.updatedAt;
      return file;
    }
    return null;
  }

  fromFileToFileModel(file: File): FileModel {
    if (file) {
      const fileModel: FileModel = new FileModel();
      fileModel.id = file.id;
      fileModel.name = file.name;
      fileModel.size = file.size;
      fileModel.mimetype = file.mimetype;
      fileModel.createdAt = file.createdAt;
      fileModel.updatedAt = file.updatedAt;
      if (file.permissions != null) {
        fileModel.sharedWith = [];
        for (const permission of file.permissions) {
          if (permission.user) {
            const userModel: UserModel = new UserModel();
            userModel.id = permission.user.id;
            userModel.email = permission.user.email;
            fileModel.sharedWith.push(userModel);
          }
        }
      }
      return fileModel;
    }
    return null;
  }

  fromFileModelToFilePresenter(fileModel: FileModel): FilePresenter {
    if (fileModel) {
      const filePresenter: FilePresenter = new FilePresenter();
      filePresenter.id = fileModel.id;
      filePresenter.name = fileModel.name;
      filePresenter.size = fileModel.size;
      filePresenter.mimetype = fileModel.mimetype;
      filePresenter.createdAt = fileModel.createdAt;
      filePresenter.updatedAt = fileModel.updatedAt;
      if (fileModel.sharedWith) {
        filePresenter.sharedWith = [];
        for (const user of fileModel.sharedWith) {
          const userPresenter: UserPresenter = new UserPresenter();
          userPresenter.id = user.id;
          userPresenter.email = user.email;
          filePresenter.sharedWith.push(userPresenter);
        }
      }
      return filePresenter;
    }
    return null;
  }
}

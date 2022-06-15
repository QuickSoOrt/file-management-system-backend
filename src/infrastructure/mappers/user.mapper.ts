import { UserModel } from '../../domain/models/user.model';
import User from '../entities/mikro-orm/user.entity';
import { UserPresenter } from '../presenters/user.presenter';

export class UserMapper {
  fromUserModelToUser(userModel: UserModel): User {
    if (userModel) {
      const user: User = new User();
      user.id = userModel.id;
      user.email = userModel.email;
      user.password = userModel.password;
      return user;
    }
    return null;
  }

  fromUserToUserModel(user: User): UserModel {
    if (user) {
      const userModel: UserModel = new UserModel();
      userModel.id = user.id;
      userModel.email = user.email;
      userModel.password = user.password;
      return userModel;
    }
    return null;
  }

  fromUserModelToUserPresenter(userModel: UserModel): UserPresenter {
    if (userModel) {
      const userPresenter: UserPresenter = new UserPresenter();
      userPresenter.id = userModel.id;
      userPresenter.email = userModel.email;
      return userPresenter;
    }
    return null;
  }
}

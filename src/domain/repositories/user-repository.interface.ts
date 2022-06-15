import { UserModel } from '../models/user.model';
import { ObjectID } from 'mongodb';

export interface IUserRepository {
  insert(userModel: UserModel): Promise<UserModel>;

  findAll(): Promise<UserModel[]>;

  findByEmail(email: string): Promise<UserModel>;

  findById(_id: ObjectID): Promise<UserModel>;

  /*
  updateContent(id: number, isDone: boolean): Promise<void>;

  deleteById(id: number): Promise<void>;
   */
}

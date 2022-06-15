import { UserModel } from '../../../domain/models/user.model';

export class SignInUseCaseResponse {
  user: UserModel;
  cookie: string;
}

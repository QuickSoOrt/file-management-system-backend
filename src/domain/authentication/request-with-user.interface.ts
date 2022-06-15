import { Request } from 'express';
import { UserPresenter } from '../../infrastructure/presenters/user.presenter';

interface IRequestWithUser extends Request {
  user: UserPresenter;
}

export default IRequestWithUser;

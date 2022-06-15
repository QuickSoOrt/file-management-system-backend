import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ErrorMessage } from '../../../domain/error-messages/error-message';
import { UserPresenter } from '../../presenters/user.presenter';
import { UserRepository } from '../../repositories/mikro-orm/user.repository';
import { UnitOfWork } from '../../repositories/unit-of-work/unit-of-work';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(UnitOfWork)
    private unitOfWork: UnitOfWork,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }
  async validate(email: string, password: string): Promise<UserPresenter> {
    const user = await this.unitOfWork.getUserRepository().findByEmail(email);
    if (user) {
      const isPasswordMatching = await bcrypt.compare(password, user.password);
      if (!isPasswordMatching) {
        throw new UnauthorizedException(
          ErrorMessage.INVALID_CREDENTIALS_PROVIDED,
        );
      }
    } else {
      throw new UnauthorizedException(
        ErrorMessage.INVALID_CREDENTIALS_PROVIDED,
      );
    }
    return user;
  }
}

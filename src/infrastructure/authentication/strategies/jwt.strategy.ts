import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { TokenPayload } from '../../../domain/authentication/token-payload';
import { JwtEnvironmentConfigService } from '../../config/environment-config/jwt/jwt-environment-config.service';
import { UserMapper } from '../../mappers/user.mapper';
import { UserRepository } from 'src/infrastructure/repositories/mikro-orm/user.repository';
import { UnitOfWork } from '../../repositories/unit-of-work/unit-of-work';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(UnitOfWork)
    private unitOfWork: UnitOfWork,
    @Inject(UserMapper)
    private userMapper: UserMapper,
    @Inject(JwtEnvironmentConfigService)
    private configService: JwtEnvironmentConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: configService.getJwtSecret(),
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.unitOfWork.getUserRepository().findById(payload.id);
    return this.userMapper.fromUserModelToUserPresenter(user);
  }
}

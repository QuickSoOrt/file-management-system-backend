import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInUseCaseResponse } from './sign-in-use-case-response';
import { ILogger } from '../../../domain/logger/logger.interface';
import { JwtEnvironmentConfigService } from '../../../infrastructure/config/environment-config/jwt/jwt-environment-config.service';
import { ErrorMessage } from '../../../domain/error-messages/error-message';
import { TokenPayload } from '../../../domain/authentication/token-payload';
import { UnitOfWork } from '../../../infrastructure/repositories/unit-of-work/unit-of-work';
import { UserMapper } from '../../../infrastructure/mappers/user.mapper';

export class SignInUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly unitOfWork: UnitOfWork,
    private readonly jwtService: JwtService,
    private readonly jwtEnvironmentConfigService: JwtEnvironmentConfigService,
    private readonly userMapper: UserMapper,
  ) {}

  async execute(
    email: string,
    password: string,
  ): Promise<SignInUseCaseResponse> {
    const user = await this.unitOfWork.getUserRepository().findByEmail(email);
    if (user) {
      const isPasswordMatching = await bcrypt.compare(password, user.password);

      if (!isPasswordMatching) {
        throw new UnauthorizedException(
          ErrorMessage.INVALID_CREDENTIALS_PROVIDED,
        );
      } else {
        const id = user.id;
        const payload: TokenPayload = { id };
        const token = this.jwtService.sign(payload);
        const response: SignInUseCaseResponse = new SignInUseCaseResponse();
        response.user = this.userMapper.fromUserToUserModel(user);
        response.cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.jwtEnvironmentConfigService.getJwtExpirationTime()}`;
        return response;
      }
    } else {
      throw new UnauthorizedException(
        ErrorMessage.INVALID_CREDENTIALS_PROVIDED,
      );
    }
  }
}

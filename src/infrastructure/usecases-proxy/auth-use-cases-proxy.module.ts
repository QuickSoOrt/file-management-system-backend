import { DynamicModule, Module } from '@nestjs/common';
import { UseCaseProxy } from './usecase-proxy';
import { LoggerService } from '../logger/logger.service';
import { LoggerModule } from '../logger/logger.module';
import { JwtConfigModule } from '../config/jwt/jwt.module';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
import { JwtEnvironmentConfigService } from '../config/environment-config/jwt/jwt-environment-config.service';
import { SignInUseCase } from '../../usecases/auth/sign-in/sign-in.use-case';
import { SignUpUseCase } from '../../usecases/auth/sing-up/sign-up.use-case';
import { SignOutUseCase } from '../../usecases/auth/sign-out/sign-out.use-case';
import { UnitOfWorkModule } from '../repositories/unit-of-work/unit-of-work.module';
import { UnitOfWork } from '../repositories/unit-of-work/unit-of-work';
import { MappersModule } from '../mappers/mappers.module';
import { UserMapper } from '../mappers/user.mapper';
import { JwtService } from '@nestjs/jwt';
import { FsService } from '../services/fs.service';
import { FsModule } from '../services/fs.module';

@Module({
  imports: [
    LoggerModule,
    UnitOfWorkModule,
    EnvironmentConfigModule,
    MappersModule,
    JwtConfigModule,
    FsModule,
  ],
})
export class AuthUseCasesProxyModule {
  static SIGN_IN_USECASE_PROXY = 'SignInUseCaseProxy';
  static SIGN_UP_USECASE_PROXY = 'SignUpUseCaseProxy';
  static SIGN_OUT_USECASE_PROXY = 'SignOutUseCaseProxy';

  static register(): DynamicModule {
    return {
      module: AuthUseCasesProxyModule,
      providers: [
        {
          inject: [
            LoggerService,
            UnitOfWork,
            JwtService,
            JwtEnvironmentConfigService,
            UserMapper,
          ],
          provide: AuthUseCasesProxyModule.SIGN_IN_USECASE_PROXY,
          useFactory: (
            logger: LoggerService,
            unityOfWork: UnitOfWork,
            jwtService: JwtService,
            jwtEnvironmentConfigService: JwtEnvironmentConfigService,
            userMapper: UserMapper,
          ) =>
            new UseCaseProxy(
              new SignInUseCase(
                logger,
                unityOfWork,
                jwtService,
                jwtEnvironmentConfigService,
                userMapper,
              ),
            ),
        },
        {
          inject: [LoggerService, UnitOfWork, UserMapper, FsService],
          provide: AuthUseCasesProxyModule.SIGN_UP_USECASE_PROXY,
          useFactory: (
            logger: LoggerService,
            unitOfWork: UnitOfWork,
            userMapper: UserMapper,
            fsService: FsService,
          ) =>
            new UseCaseProxy(
              new SignUpUseCase(logger, unitOfWork, userMapper, fsService),
            ),
        },
        {
          inject: [LoggerService, UnitOfWork],
          provide: AuthUseCasesProxyModule.SIGN_OUT_USECASE_PROXY,
          useFactory: (logger: LoggerService, unitOfWork: UnitOfWork) =>
            new UseCaseProxy(new SignOutUseCase(logger, unitOfWork)),
        },
      ],
      exports: [
        AuthUseCasesProxyModule.SIGN_IN_USECASE_PROXY,
        AuthUseCasesProxyModule.SIGN_UP_USECASE_PROXY,
        AuthUseCasesProxyModule.SIGN_OUT_USECASE_PROXY,
      ],
    };
  }
}

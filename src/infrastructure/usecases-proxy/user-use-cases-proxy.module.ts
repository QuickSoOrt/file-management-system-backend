import { DynamicModule, Module } from '@nestjs/common';
import { UseCaseProxy } from './usecase-proxy';
import { LoggerService } from '../logger/logger.service';
import { LoggerModule } from '../logger/logger.module';
import { UnitOfWorkModule } from '../repositories/unit-of-work/unit-of-work.module';
import { UnitOfWork } from '../repositories/unit-of-work/unit-of-work';
import { MappersModule } from '../mappers/mappers.module';
import { UserMapper } from '../mappers/user.mapper';
import { GetUsersUseCase } from '../../usecases/user/get-users/get-users.use-case';

@Module({
  imports: [LoggerModule, UnitOfWorkModule, MappersModule],
})
export class UserUseCasesProxyModule {
  static GET_USERS_USECASE_PROXY = 'GetUsersUseCaseProxy';

  static register(): DynamicModule {
    return {
      module: UserUseCasesProxyModule,
      providers: [
        {
          inject: [LoggerService, UnitOfWork, UserMapper],
          provide: UserUseCasesProxyModule.GET_USERS_USECASE_PROXY,
          useFactory: (
            logger: LoggerService,
            unityOfWork: UnitOfWork,
            userMapper: UserMapper,
          ) =>
            new UseCaseProxy(
              new GetUsersUseCase(logger, unityOfWork, userMapper),
            ),
        },
      ],
      exports: [UserUseCasesProxyModule.GET_USERS_USECASE_PROXY],
    };
  }
}

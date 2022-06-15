import { Controller, Get, Inject, Post } from '@nestjs/common';
import { UseCaseProxy } from '../../usecases-proxy/usecase-proxy';
import { UserMapper } from '../../mappers/user.mapper';
import { GetUsersUseCase } from '../../../usecases/user/get-users/get-users.use-case';
import { UserUseCasesProxyModule } from '../../usecases-proxy/user-use-cases-proxy.module';
import { GetUsersUseCaseRequest } from '../../../usecases/user/get-users/get-users-use-case-request';
import { UserPresenter } from '../../presenters/user.presenter';

@Controller('users')
export class UserController {
  constructor(
    @Inject(UserMapper)
    private readonly userMapper: UserMapper,
    @Inject(UserUseCasesProxyModule.GET_USERS_USECASE_PROXY)
    private readonly getUsersUseCaseProxy: UseCaseProxy<GetUsersUseCase>,
  ) {}

  @Get('')
  async getUsers(): Promise<UserPresenter[]> {
    const getUsersUseCaseRequest: GetUsersUseCaseRequest =
      new GetUsersUseCaseRequest();

    const { users } = await this.getUsersUseCaseProxy
      .getInstance()
      .execute(getUsersUseCaseRequest);

    return users.map((u) => this.userMapper.fromUserModelToUserPresenter(u));
  }
}

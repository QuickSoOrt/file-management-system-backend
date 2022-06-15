import { ILogger } from '../../../domain/logger/logger.interface';
import { UnitOfWork } from '../../../infrastructure/repositories/unit-of-work/unit-of-work';
import { GetUsersUseCaseRequest } from './get-users-use-case-request';
import { GetUsersUseCaseResponse } from './get-users-use-case-response';
import { UserMapper } from '../../../infrastructure/mappers/user.mapper';

export class GetUsersUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly unitOfWork: UnitOfWork,
    private readonly userMapper: UserMapper,
  ) {}

  async execute(
    request: GetUsersUseCaseRequest,
  ): Promise<GetUsersUseCaseResponse> {
    const users = await this.unitOfWork.getUserRepository().findUsers();

    const response: GetUsersUseCaseResponse = new GetUsersUseCaseResponse();

    response.users = users.map((u) => this.userMapper.fromUserToUserModel(u));

    return response;
  }
}

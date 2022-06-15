import { ILogger } from '../../../domain/logger/logger.interface';
import { UnitOfWork } from '../../../infrastructure/repositories/unit-of-work/unit-of-work';

export class SignOutUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async execute(): Promise<string> {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}

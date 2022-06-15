import { Module } from '@nestjs/common';
import { UnitOfWork } from './unit-of-work';
import { MikroOrmRepositoriesModule } from '../mikro-orm/mikro-orm-repositories.module';

@Module({
  imports: [MikroOrmRepositoriesModule],
  providers: [UnitOfWork],
  exports: [UnitOfWork],
})
export class UnitOfWorkModule {}

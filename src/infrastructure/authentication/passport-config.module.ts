import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtConfigModule } from '../config/jwt/jwt.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MappersModule } from '../mappers/mappers.module';
import { MikroOrmRepositoriesModule } from '../repositories/mikro-orm/mikro-orm-repositories.module';
import { UnitOfWorkModule } from '../repositories/unit-of-work/unit-of-work.module';

@Module({
  imports: [
    MikroOrmRepositoriesModule,
    UnitOfWorkModule,
    PassportModule,
    JwtConfigModule,
    MappersModule,
  ],
  providers: [LocalStrategy, JwtStrategy],
  exports: [PassportModule, LocalStrategy, JwtStrategy],
})
export class PassportConfigModule {}

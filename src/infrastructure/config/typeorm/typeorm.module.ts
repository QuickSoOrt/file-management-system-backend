import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EnvironmentConfigModule } from '../environment-config/environment-config.module';
import { MongoDBEnvironmentConfigService } from '../environment-config/mongodb/mongodb-environment-config.service';

export const getTypeOrmModuleOptions = (
  config: MongoDBEnvironmentConfigService,
): TypeOrmModuleOptions =>
  ({
    type: 'mongodb',
    url: config.getDatabaseURL(),
    entities: [__dirname + './../../entities/type-orm/*.entity{.ts,.js}'],
    synchronize: true,
    migrationsRun: true,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    cli: {
      migrationsDir: 'src/migrations',
    },
    // ssl: {
    //   rejectUnauthorized: false,
    // },
  } as TypeOrmModuleOptions);

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [MongoDBEnvironmentConfigService],
      useFactory: getTypeOrmModuleOptions,
    }),
  ],
})
export class TypeOrmConfigModule {}

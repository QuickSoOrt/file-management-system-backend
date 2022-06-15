import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IMongoDBDatabaseConfig } from '../../../../domain/config/mongodb-database-config.interface';

@Injectable()
export class MongoDBEnvironmentConfigService implements IMongoDBDatabaseConfig {
  constructor(private configService: ConfigService) {}

  getDatabaseURL(): string {
    return this.configService.get<string>('DATABASE_URL');
  }
}

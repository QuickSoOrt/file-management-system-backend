import { IsEnum, IsString } from 'class-validator';
import { Environment } from '../environment';

export class MongoDBEnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;
  @IsString()
  DATABASE_URL: string;
}

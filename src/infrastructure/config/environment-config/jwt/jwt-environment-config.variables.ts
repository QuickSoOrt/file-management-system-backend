import { IsEnum, IsString } from 'class-validator';
import { Environment } from '../environment';

export class JwtEnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;
  @IsString()
  JWT_SECRET: string;
  @IsString()
  JWT_EXPIRATION_TIME: string;
}

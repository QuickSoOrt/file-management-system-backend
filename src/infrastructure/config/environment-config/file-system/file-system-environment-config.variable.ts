import { IsEnum, IsString } from 'class-validator';
import { Environment } from '../environment';

export class FileSystemEnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  UPLOAD_FILES_PRIVATE_LOCATION: string;

  @IsString()
  UPLOAD_FILES_PUBLIC_LOCATION: string;

  @IsString()
  FILE_ENCRYPTION_KEY: string;
}

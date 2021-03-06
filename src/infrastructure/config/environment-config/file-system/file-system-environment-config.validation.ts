import { plainToClass } from 'class-transformer';
import { IsEnum, IsString, validateSync } from 'class-validator';
import { FileSystemEnvironmentVariables } from './file-system-environment-config.variable';

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(FileSystemEnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}

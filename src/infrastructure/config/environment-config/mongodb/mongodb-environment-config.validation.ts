import { plainToClass } from 'class-transformer';
import { IsEnum, IsString, validateSync } from 'class-validator';
import { MongoDBEnvironmentVariables } from './mongodb-environment-variables';

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(MongoDBEnvironmentVariables, config, {
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

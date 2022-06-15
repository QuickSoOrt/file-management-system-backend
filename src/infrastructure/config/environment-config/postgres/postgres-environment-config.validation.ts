import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { PostgresEnvironmentVariables } from './postgres-environment-variables';

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(PostgresEnvironmentVariables, config, {
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

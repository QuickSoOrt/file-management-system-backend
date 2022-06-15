import { plainToClass } from 'class-transformer';
import { IsEnum, IsString, validateSync } from 'class-validator';
import { JwtEnvironmentVariables } from './jwt-environment-config.variables';

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(JwtEnvironmentVariables, config, {
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

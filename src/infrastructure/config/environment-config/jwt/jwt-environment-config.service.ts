import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IJwtConfigInterface } from '../../../../domain/config/jwt-config.interface';

@Injectable()
export class JwtEnvironmentConfigService implements IJwtConfigInterface {
  constructor(private configService: ConfigService) {}

  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  getJwtExpirationTime(): string {
    return this.configService.get<string>('JWT_EXPIRATION_TIME');
  }
}

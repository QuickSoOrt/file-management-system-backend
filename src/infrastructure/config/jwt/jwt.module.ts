import { Module } from '@nestjs/common';
import { EnvironmentConfigModule } from '../environment-config/environment-config.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtEnvironmentConfigService } from '../environment-config/jwt/jwt-environment-config.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [EnvironmentConfigModule],
      inject: [JwtEnvironmentConfigService],
      useFactory: async (configService: JwtEnvironmentConfigService) => ({
        secret: configService.getJwtSecret(),
        signOptions: {
          expiresIn: `${configService.getJwtExpirationTime()}s`,
        },
      }),
    }),
  ],
  providers: [JwtModule, JwtEnvironmentConfigService],
  exports: [JwtModule, JwtEnvironmentConfigService],
})
export class JwtConfigModule {}

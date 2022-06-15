import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoDBEnvironmentConfigService } from './mongodb/mongodb-environment-config.service';
import { JwtEnvironmentConfigService } from './jwt/jwt-environment-config.service';
import { FileSystemEnvironmentConfigService } from './file-system/file-system-environment-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './env/local.env',
      ignoreEnvFile: !(
        process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'test'
      ),
      isGlobal: true,
    }),
  ],
  providers: [
    MongoDBEnvironmentConfigService,
    JwtEnvironmentConfigService,
    FileSystemEnvironmentConfigService,
  ],
  exports: [
    MongoDBEnvironmentConfigService,
    JwtEnvironmentConfigService,
    FileSystemEnvironmentConfigService,
  ],
})
export class EnvironmentConfigModule {}

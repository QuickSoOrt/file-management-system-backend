import { Module } from '@nestjs/common';
import {
  ServeStaticModule,
  ServeStaticModuleOptions,
} from '@nestjs/serve-static';
import { EnvironmentConfigModule } from '../environment-config/environment-config.module';
import { FileSystemEnvironmentConfigService } from '../environment-config/file-system/file-system-environment-config.service';

@Module({
  imports: [
    ServeStaticModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [FileSystemEnvironmentConfigService],
      useFactory: (configService: FileSystemEnvironmentConfigService) => [
        {
          rootPath: configService.getUploadedFilesPublicLocation(),
          exclude: ['/api*'],
          serveRoot: '/public',
        },
      ],
    }),
  ],
})
export class ServeStaticConfigModule {}

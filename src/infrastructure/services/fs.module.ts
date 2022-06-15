import { Module } from '@nestjs/common';
import { FsService } from './fs.service';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';

@Module({
  imports: [EnvironmentConfigModule],
  providers: [FsService],
  exports: [FsService],
})
export class FsModule {}

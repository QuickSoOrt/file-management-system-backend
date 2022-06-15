import { Module } from '@nestjs/common';
import { ControllersModule } from './infrastructure/controllers/controllers.module';
import { AuthUseCasesProxyModule } from './infrastructure/usecases-proxy/auth-use-cases-proxy.module';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { PassportConfigModule } from './infrastructure/authentication/passport-config.module';
import { ServeStaticConfigModule } from './infrastructure/config/serve-static/serve-static.module';

@Module({
  imports: [
    AuthUseCasesProxyModule,
    ControllersModule,
    LoggerModule,
    PassportConfigModule,
    ServeStaticConfigModule,
  ],
})
export class AppModule {}

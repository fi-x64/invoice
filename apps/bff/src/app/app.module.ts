import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { UserGuard } from '@common/guards/user.guard';
import { ExceptionInterceptor } from '@common/interceptors/exception.interceptor';
import { LoggerMiddleware } from '@common/middlewares/logger.middleware';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ClientsModule } from '@nestjs/microservices';
import { CONFIGURATION, TConfiguration } from './configuration';
import { AuthorizerModule } from './modules/authorizer/authorizer.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [() => CONFIGURATION] }),
    InvoiceModule,
    ProductModule,
    UserModule,
    AuthorizerModule,
    ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.AUTHORIZER_SERVICE)]),
  ],
  controllers: [],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ExceptionInterceptor },
    {
      provide: APP_GUARD,
      useClass: UserGuard,
    },
  ],
})
export class AppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

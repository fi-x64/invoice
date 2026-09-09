import { ExceptionInterceptor } from '@common/interceptors/exception.interceptor';
import { LoggerMiddleware } from '@common/middlewares/logger.middleware';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CONFIGURATION, TConfiguration } from '../configuration';

import { GRPC_SERVICES, GrpcProvider } from '@common/configuration/grpc.config';
import { RedisProvider } from '@common/configuration/redis.config';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { ThrottlerProvider } from '@common/configuration/throttler.config';
import { PermissionGuard } from '@common/guards/permission.guard';
import { UserGuard } from '@common/guards/user.guard';
import { ClientsModule } from '@nestjs/microservices';
import { ThrottlerGuard } from '@nestjs/throttler';
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
    RedisProvider,
    ThrottlerProvider,
    ClientsModule.registerAsync([GrpcProvider(GRPC_SERVICES.AUTHORIZER_SERVICE)]),
  ],
  controllers: [],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ExceptionInterceptor },
    {
      provide: APP_GUARD,
      useClass: UserGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

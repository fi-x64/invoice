import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION, TConfiguration } from '../configuration';
import { AuthorizerModule } from './modules/authorizer/authorizer.module';
import { AuthorizerController } from './modules/authorizer/controllers/authorizer.controller';
import { AuthorizerService } from './modules/authorizer/services/authorizer.service';
import { KeycloakModule } from './modules/keycloak/keycloak.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [() => CONFIGURATION] }), KeycloakModule, AuthorizerModule],
  controllers: [AuthorizerController],
  providers: [AuthorizerService],
})
export class AppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;
}

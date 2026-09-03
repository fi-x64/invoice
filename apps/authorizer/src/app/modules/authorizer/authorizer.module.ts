import { Module } from '@nestjs/common';
import { KeycloakModule } from '../keycloak/keycloak.module';
import { AuthorizerController } from './controllers/authorizer.controller';
import { AuthorizerService } from './services/authorizer.service';

@Module({
  imports: [KeycloakModule],
  controllers: [AuthorizerController],
  providers: [AuthorizerService],
})
export class AuthorizerModule {}

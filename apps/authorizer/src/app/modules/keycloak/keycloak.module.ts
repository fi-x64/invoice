import { Module } from '@nestjs/common';
import { KeycloakController } from './controllers/keycloak.controller';
import { KeycloakHttpService } from './services/keycloak-http.service';

@Module({
  controllers: [KeycloakController],
  providers: [KeycloakHttpService],
  exports: [KeycloakHttpService],
})
export class KeycloakModule {}

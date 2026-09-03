import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { RequestParams } from '@common/decorators/request.param.decorator';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { CreateKeycloakUserTcpReq } from '@common/interfaces/tcp/authorizer';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { KeycloakHttpService } from '../services/keycloak-http.service';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class KeycloakController {
  constructor(private readonly keycloakHttpService: KeycloakHttpService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.KEYCLOAK.CREATE_USER)
  async createUser(@RequestParams() data: CreateKeycloakUserTcpReq): Promise<Response<string>> {
    const result = await this.keycloakHttpService.createUser(data);
    return Response.success<string>(result);
  }
}

import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { ProcessId } from '@common/decorators/processId.decorator';
import { LoginRequestDto, LoginResponseDto } from '@common/interfaces/gateway/authorizer';
import { ResponseDto } from '@common/interfaces/gateway/response.interfaces';
import { LoginTcpRequest, LoginTcpResponse } from '@common/interfaces/tcp/authorizer';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { map } from 'rxjs';

@ApiTags('Authorizer')
@Controller('authorizer')
export class AuthorizerController {
  constructor(@Inject(TCP_SERVICES.AUTHORIZER_SERVICE) private readonly authorizerClient: TcpClient) {}

  @Post('login')
  @ApiOkResponse({
    type: ResponseDto<LoginResponseDto>,
  })
  @ApiOperation({
    summary: 'Login with username and password',
  })
  login(@Body() body: LoginRequestDto, @ProcessId() processId: string) {
    return this.authorizerClient
      .send<LoginTcpResponse, LoginTcpRequest>(TCP_REQUEST_MESSAGE.AUTHORIZER.LOGIN, {
        data: body,
        processId,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }
}

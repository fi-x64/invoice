import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { Authorization } from '@common/decorators/authorizer.decorator';
import { ProcessId } from '@common/decorators/processid.decorator';
import { ResponseDto } from '@common/interfaces/gateway/response.interfaces';
import { CreateUserRequestDto } from '@common/interfaces/gateway/user';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { map } from 'rxjs';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(@Inject(TCP_SERVICES.USER_ACCESS_SERVICE) private readonly userAcessClient: TcpClient) {}

  @Post()
  @ApiResponse({ type: ResponseDto<string> })
  @ApiOperation({ summary: 'Create a new user' })
  @Authorization({ secured: true })
  create(@Body() body: CreateUserRequestDto, @ProcessId() processId: string) {
    return this.userAcessClient
      .send<string, CreateUserTcpRequest>(TCP_REQUEST_MESSAGE.USER.CREATE, {
        data: body,
        processId,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }
}

import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { RequestParams } from '@common/decorators/request.param.decorator';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from '../services/user.service';
@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.USER.CREATE)
  async create(@RequestParams() data: CreateUserTcpRequest) {
    await this.userService.create(data);
    return Response.success<string>(HTTP_MESSAGE.CREATED);
  }
}

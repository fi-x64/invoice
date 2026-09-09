import { Response } from '@common/interfaces/grpc/common/response.interface';
import { UserById } from '@common/interfaces/grpc/user-access';
import { User } from '@common/schemas/user.schema';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from '../services/user.service';

@Controller()
export class UserGrpcController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserAccessService', 'getByUserId')
  async getByUserId(payload: UserById): Promise<Response<User>> {
    const result = await this.userService.getUserByUserId(payload.userId);

    return Response.success<User>(result);
  }
}

import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { ERROR_CODE } from '@common/constants/enum/error-code.enum';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { CreateKeycloakUserTcpReq } from '@common/interfaces/tcp/authorizer';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { createUserRequestMapping } from '../mappers';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(TCP_SERVICES.AUTHORIZER_SERVICE) private readonly authorizeclient: TcpClient,
  ) {}

  async create(params: CreateUserTcpRequest, processId: string) {
    const isExist = await this.userRepository.exists(params.email);

    if (isExist) {
      throw new BadRequestException(ERROR_CODE.USER_ALREADY_EXISTS);
    }

    const userId = await this.createKeycloakUser(
      { email: params.email, password: params.password, firstName: params.firstName, lastName: params.lastName },
      processId,
    );

    const input = createUserRequestMapping(params, userId);

    return this.userRepository.create(input);
  }

  getByUserIdOrEmail(params: { userId?: string; email?: string }) {
    return this.userRepository.getByUserIdOrEmail(params);
  }

  createKeycloakUser(data: CreateKeycloakUserTcpReq, processId: string) {
    return firstValueFrom(
      this.authorizeclient
        .send<string>(TCP_REQUEST_MESSAGE.KEYCLOAK.CREATE_USER, { data, processId })
        .pipe(map((data) => data.data)),
    );
  }
}

import { ERROR_CODE } from '@common/constants/enum/error-code.enum';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { BadRequestException, Injectable } from '@nestjs/common';
import { createUserRequestMapping } from '../mappers';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(params: CreateUserTcpRequest) {
    const isExist = await this.userRepository.exists(params.email);

    if (isExist) {
      throw new BadRequestException(ERROR_CODE.USER_ALREADY_EXISTS);
    }

    const input = createUserRequestMapping(params);

    return this.userRepository.create(input);
  }
}

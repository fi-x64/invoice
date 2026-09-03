import { PERMISSION } from '@common/constants/enum/role.enum';
import { User } from '@common/schemas/user.schema';
import { JwtPayload } from 'jsonwebtoken';
import { LoginResponseDto } from '../../gateway/authorizer';
export type LoginTcpResponse = LoginResponseDto;

export class AuthorizerdMetadata {
  userId: string | undefined;
  user: User | undefined;
  permissions: PERMISSION[] | undefined;
  jwt: JwtPayload | undefined;

  constructor(payload?: Partial<AuthorizerdMetadata>) {
    Object.assign(this, payload);
  }
}

export class AuthorizeResponse {
  valid = false;
  metadata = new AuthorizerdMetadata();

  constructor(payload?: Partial<AuthorizeResponse>) {
    Object.assign(this, payload);
  }
}

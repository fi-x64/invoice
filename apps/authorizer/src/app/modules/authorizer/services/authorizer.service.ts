import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { AuthorizeResponse, LoginTcpRequest } from '@common/interfaces/tcp/authorizer';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Role } from '@common/schemas/role.schema';
import { User } from '@common/schemas/user.schema';
import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import jwksRsa, { JwksClient } from 'jwks-rsa';
import { firstValueFrom, map } from 'rxjs';
import { KeycloakHttpService } from '../../keycloak/services/keycloak-http.service';

@Injectable()
export class AuthorizerService {
  private readonly logger = new Logger(AuthorizerService.name);
  private jwksClient: JwksClient;

  constructor(
    private readonly keycloakHttpService: KeycloakHttpService,
    private readonly configService: ConfigService,
    @Inject(TCP_SERVICES.USER_ACCESS_SERVICE) private readonly userAccessClient: TcpClient,
  ) {
    const host = this.configService.get('KEYCLOAK_CONFIG.HOST');
    const realm = this.configService.get('KEYCLOAK_CONFIG.REALM');

    this.jwksClient = jwksRsa({
      jwksUri: `${host}/realms/${realm}/protocol/openid-connect/certs`,
      cache: true,
      rateLimit: true,
    });
  }

  async login(params: LoginTcpRequest) {
    const { password, username } = params;

    const { access_token: accessToken, refresh_token: refreshToken } = await this.keycloakHttpService.exchangeUserToken(
      { username, password },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyUserToken(token: string, processId: string): Promise<AuthorizeResponse> {
    const decoded = jwt.decode(token, { complete: true }) as Jwt;
    if (!decoded || !decoded.header || !decoded.header.kid) {
      throw new UnauthorizedException('Invalid token structure');
    }

    try {
      const key = await this.jwksClient.getSigningKey(decoded.header.kid);
      const publicKey = key.getPublicKey();
      const payload = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as JwtPayload;
      this.logger.debug({ payload });

      const user = await this.getUserByUserId({ userId: payload.sub, email: payload.email }, processId);
      const permissions = user?.roles
        ? (user.roles as unknown as Role[]).map((role) => role.permissions ?? []).flat()
        : [];
      if (!user) {
        this.logger.warn(`No local user found for keycloak user '${payload.sub}' (${payload.email ?? 'no email'})`);
      }

      return {
        valid: true,
        metadata: {
          jwt: payload,
          permissions,
          user,
          userId: user?.id ?? payload.sub,
        },
      };
    } catch (error) {
      this.logger.error({ error });
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Invalid token');
    }
  }

  private getUserByUserId(params: { userId?: string; email?: string }, processId: string) {
    return firstValueFrom(
      this.userAccessClient
        .send<User, { userId?: string; email?: string }>(TCP_REQUEST_MESSAGE.USER.GET_BY_USER_ID, {
          data: params,
          processId,
        })
        .pipe(map((data) => data.data)),
    );
  }
}

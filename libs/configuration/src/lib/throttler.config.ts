import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

export const ThrottlerProvider = ThrottlerModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    throttlers: [{ ttl: 6000, limit: 5 }],
    errorMessage: 'Too many requests, please try again later.',
    storage: new ThrottlerStorageRedisService({
      host: configService.get('REDIS_CONFIG.HOST'),
      port: configService.get('REDIS_CONFIG.PORT'),
    }),
  }),
});

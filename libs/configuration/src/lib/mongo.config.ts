import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

type MongoConfigurationInput = Partial<MongoConfiguration> & {
  MONGO_URL?: string;
  MONGO_DB_NAME?: string;
  MONGO_POOL_SIZE?: number | string;
  MONGO_CONNECTION_TIMEOUT_MS?: number | string;
  MONGO_SOCKET_TIMEOUT_MS?: number | string;
};

export class MongoConfiguration {
  private static readonly env = process.env;

  @IsString()
  @IsNotEmpty()
  URL!: string;

  @IsString()
  @IsNotEmpty()
  DB_NAME!: string;

  @IsNumber()
  @IsOptional()
  POOL_SIZE!: number;

  @IsNumber()
  @IsOptional()
  CONNECTION_TIMEOUT_MS!: number;

  @IsNumber()
  @IsOptional()
  SOCKET_TIMEOUT_MS!: number;

  constructor(data?: MongoConfigurationInput) {
    this.URL = data?.URL || data?.MONGO_URL || MongoConfiguration.env['MONGO_URL'] || 'mongodb://localhost:27017';
    this.DB_NAME = data?.DB_NAME || data?.MONGO_DB_NAME || MongoConfiguration.env['MONGO_DB_NAME'] || 'test';
    this.POOL_SIZE = MongoConfiguration.parseNumber(
      data?.POOL_SIZE ?? data?.MONGO_POOL_SIZE ?? MongoConfiguration.env['MONGO_POOL_SIZE'],
      10,
    );
    this.CONNECTION_TIMEOUT_MS = MongoConfiguration.parseNumber(
      data?.CONNECTION_TIMEOUT_MS ??
        data?.MONGO_CONNECTION_TIMEOUT_MS ??
        MongoConfiguration.env['MONGO_CONNECTION_TIMEOUT_MS'],
      30000,
    );
    this.SOCKET_TIMEOUT_MS = MongoConfiguration.parseNumber(
      data?.SOCKET_TIMEOUT_MS ?? data?.MONGO_SOCKET_TIMEOUT_MS ?? MongoConfiguration.env['MONGO_SOCKET_TIMEOUT_MS'],
      30000,
    );
  }

  private static parseNumber(value: number | string | undefined, fallback: number): number {
    if (value === undefined || value === '') {
      return fallback;
    }

    return Number(value);
  }
}

export const MongoProvider = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>('MONGO_CONFIG.URL', 'mongodb://localhost:27017'),
    dbName: configService.get<string>('MONGO_CONFIG.DB_NAME', 'test'),
    maxPoolSize: configService.get<number>('MONGO_CONFIG.POOL_SIZE', 10),
    connectTimeoutMS: configService.get<number>('MONGO_CONFIG.CONNECTION_TIMEOUT_MS', 30000),
    socketTimeoutMS: configService.get<number>('MONGO_CONFIG.SOCKET_TIMEOUT_MS', 30000),
    onConnectionCreate: (connection) => {
      connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });
      connection.on('disconnected', () => {
        console.warn('MongoDB connection disconnected');
      });
      connection.on('reconnected', () => {
        console.info('MongoDB connection reconnected');
      });
      connection.on('disconnecting', () => {
        console.warn('MongoDB connection disconnecting');
      });
      connection.on('close', () => {
        console.info('MongoDB connection closed');
      });

      return connection;
    },
  }),
});

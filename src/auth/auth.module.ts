import { Module, CacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CryptService } from '../services/crypto/crypt.service';
import { JwtService } from '../services/jwt/jwt.service';
import { ConfigService } from '../config/config.service';
import { ClientProxyFactory } from '@nestjs/microservices';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_AUTH_HOST,
      port: process.env.REDIS_AUTH_PORT,
      ttl: Number(process.env.REDIS_AUTH_TTL),
    }),
  ],
  providers: [
    JwtService,
    CryptService,
    AuthService,
    ConfigService,
    {
      provide: 'USER_SERVICE',
      useFactory: (configService: ConfigService) => {
        const userServiceOptions = configService.get('userService');
        return ClientProxyFactory.create(userServiceOptions);
      },
      inject: [ConfigService],
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}

import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CryptService } from '../services/crypto/crypt.service';
import { JwtService } from '../services/jwt/jwt.service';
import { ConfigService } from '../config/config.service';
import { ClientProxyFactory } from '@nestjs/microservices';

@Module({
  imports: [],
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

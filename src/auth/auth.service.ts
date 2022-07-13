import { Inject, Injectable } from '@nestjs/common';

import { CryptService } from '../services/crypto/crypt.service';
import { JwtService } from '../services/jwt/jwt.service';

import { ClientGrpc } from '@nestjs/microservices';
import { IGrpcService } from '../user/grpc.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly cryptService: CryptService,
    private readonly jwtService: JwtService,
    @Inject('USER_SERVICE') private readonly userService: ClientGrpc,
  ) {}

  // Connection to user microservice
  private grpcService: IGrpcService;
  onModuleInit() {
    this.grpcService = this.userService.getService<IGrpcService>('UserService');
  }
}

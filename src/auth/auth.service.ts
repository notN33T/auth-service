import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { CryptService } from '../services/crypto/crypt.service';
import { JwtService } from '../services/jwt/jwt.service';

import { ClientGrpc } from '@nestjs/microservices';
import { IGrpcService } from '../user/grpc.interface';

import { RegisterDto } from './dto/register.dto';
import { UserServiceCreateResponseDto } from './dto/userServiceRegisterResponse.dto';
import { Status } from './enums/status.enum';

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

  async register(registerDto: RegisterDto): Promise<any> {
    const { name, email, password } = registerDto;
    const hashedPassword = await this.cryptService.hash(password);

    const isUserCreated: UserServiceCreateResponseDto = await lastValueFrom(
      this.grpcService.CreateUser({ name, email, password: hashedPassword }),
    );

    const statusFromResponse: Status = isUserCreated.status;
    const isCreatedStatus = Status[statusFromResponse];

    if (isCreatedStatus === Status[2]) return isUserCreated;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.generateAccessToken({ name, email }),
      this.jwtService.generateRefreshToken({ name, email }),
    ]);

    return { ...isUserCreated, accessToken, refreshToken };
  }
}

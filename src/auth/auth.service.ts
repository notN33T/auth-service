import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Cache } from 'cache-manager';

import { CryptService } from '../services/crypto/crypt.service';
import { JwtService } from '../services/jwt/jwt.service';

import { ClientGrpc } from '@nestjs/microservices';
import { IGrpcService } from '../user/grpc.interface';

import { RegisterDto } from './dto/register.dto';
import { UserServiceCreateResponseDto } from './dto/userServiceRegisterResponse.dto';
import { Status } from './enums/status.enum';
import { LoginDto } from './dto/login.dto';
import { User } from './dto/user.dto';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly cryptService: CryptService,
    private readonly jwtService: JwtService,
    @Inject('USER_SERVICE') private readonly userService: ClientGrpc,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
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

    const createdUser: User = await lastValueFrom(
      this.grpcService.GetUserByEmail({ email }),
    );

    const userId = createdUser.id;

    const statusFromResponse: Status = isUserCreated.status;
    const isCreatedStatus = Status[statusFromResponse];

    if (isCreatedStatus === Status[2]) return isUserCreated;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.generateAccessToken({ id: createdUser.id, name, email }),
      this.jwtService.generateRefreshToken({ id: createdUser.id, name, email }),
    ]);

    await this.cacheManager.set(userId, refreshToken);

    return { ...isUserCreated, accessToken, refreshToken };
  }

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;

    const userByEmailResponse = await lastValueFrom(
      this.grpcService.GetUserByEmail({ email }),
    );

    const isUserFoundStatus = userByEmailResponse.status;
    if (isUserFoundStatus === Status[2]) return { ...userByEmailResponse };

    const user: User = userByEmailResponse.user;
    const userId = user.id;

    const isPasswordMatches = await this.cryptService.compare(
      password,
      user.password,
    );

    if (!isPasswordMatches)
      return { message: 'Wrong email or password', status: Status.DENIED };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.generateAccessToken({
        id: user.id,
        name: user.name,
        email,
      }),
      this.jwtService.generateRefreshToken({
        id: user.id,
        name: user.name,
        email,
      }),
    ]);

    await this.cacheManager.set(userId, refreshToken);

    return { accessToken, refreshToken, status: Status.SUCCESS };
  }
}

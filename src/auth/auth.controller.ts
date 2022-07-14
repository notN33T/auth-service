import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Register')
  async register(registerDto: RegisterDto): Promise<any> {
    return this.authService.register(registerDto);
  }

  @GrpcMethod('AuthService', 'Login')
  async login(loginDto: LoginDto): Promise<any> {
    return this.authService.login(loginDto);
  }

  @GrpcMethod('AuthService', 'Refresh')
  async refresh(refreshDto: RefreshDto): Promise<any> {
    return this.authService.refresh(refreshDto);
  }
}

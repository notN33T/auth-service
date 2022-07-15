import { Transport } from '@nestjs/microservices';
import { join } from 'path';

export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {};

    this.envConfig.userService = {
      transport: Transport.GRPC,
      options: {
        package: 'user_service',
        url: process.env.USERS_SERVICE_URL,
        protoPath: join(__dirname, '../../src/user/user.proto'),
      },
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}

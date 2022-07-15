import { Status } from '../enums/status.enum';
import { User } from './user.dto';

export class UserServiceFindByEmailDto {
  user: User;
  status: Status;
  message: string;
}

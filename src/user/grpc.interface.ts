import { Observable } from 'rxjs';
import { Role } from '../auth/enums/role.enum';

export interface IGrpcService {
  GetUserById(GetUserByIdRequest: IGetUserByIdRequest): Observable<any>;
  CreateUser(CreateUserRequest: ICreateUserRequest): Observable<any>;
  UpdateUser(UpdateUserRequest: IUpdateUserRequest): Observable<any>;
  GetUserByEmail(
    GetUserByEmailRequest: IGetUserByEmailRequest,
  ): Observable<any>;
}

export interface IGetUserByIdRequest {
  id: string;
}

export interface ICreateUserRequest {
  email: string;
  name: string;
  password: string;
}

export interface IUpdateUserRequest {
  id: string;
  email?: string;
  name?: string;
  role?: Role;
  password?: string;
  points?: number;
}

export interface IGetUserByEmailRequest {
  email: string;
}

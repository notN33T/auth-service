import { Observable } from 'rxjs';
import { Role } from '../auth/enums/role.enum';

export interface IGrpcService {
  GetUserById(BodyForForgot: IGetUserByIdRequest): Observable<any>;
  CreateUser(BodyForReset: ICreateUserRequest): Observable<any>;
  UpdateUser(BodyForFindUser: IUpdateUserRequest): Observable<any>;
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

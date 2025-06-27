import { Model } from 'mongoose';
import { USER_ROLE } from './constant.user';

export interface TUser {
  _id?: string;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  passwordChangedAt?: Date;
}
export type TUserRole = keyof typeof USER_ROLE;

export interface UserModel extends Model<TUser> {
  //instance methods for checking if the user exist
  // eslint-disable-next-line no-unused-vars
  isUserExists(name: string): Promise<TUser>;
  //instance methods for checking if passwords are matched
  isPasswordMatched(
    // eslint-disable-next-line no-unused-vars
    plainTextPassword: string,
    // eslint-disable-next-line no-unused-vars
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    // eslint-disable-next-line no-unused-vars
    passwordChangedTimestamp: Date,
    // eslint-disable-next-line no-unused-vars
    jwtIssuedTimestamp: number,
  ): boolean;
}

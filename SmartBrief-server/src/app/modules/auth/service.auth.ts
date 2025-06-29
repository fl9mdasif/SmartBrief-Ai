import httpStatus from 'http-status'; 
import { TLoginUser, TUser } from './interface.auth';
import AppError from '../../errors/AppError';
import config from '../../config'; 
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt'; 
import { User } from './model.auth';
import { createToken } from './jwt';

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
 
const registerUser = async (payload: TUser) => {
  // create
  const register = await User.create(payload);
  return register;
};

const loginUser = async (payload: TLoginUser) => {
  //
  // 1. checking if the user is exist
  const user = await User.isUserExists(payload.username);
  // console.log(user);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, '', `This user is not found !'`);
  }

  //   2. checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(
      httpStatus.FORBIDDEN,
      '',
      `Password of '${user.role}' do not matched`,
    );
    
    // But you are creating this larger shape:
    const jwtPayload:any = {
      _id: user?._id as string,
      username: user.username,
      email: user.email,
      role: user.role, // Can be 'editor', 'reviewer', etc.
      credits: user.credits,
      // passwordChangedAt: user.passwordChangedAt,
    };
    console.log('jwt',config.jwt_access_expires_in as string,jwtPayload );

  // create token
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  // refresh token
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    data: { jwtPayload },
    accessToken,
    refreshToken,
  };
};



export const authServices = {
  loginUser,
  registerUser
};

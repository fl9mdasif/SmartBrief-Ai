import httpStatus from 'http-status';
import { User } from '../user/mode.user';
import { TLoginUser } from './interface.auth';
import AppError from '../../errors/AppError';
import config from '../../config';
import { createToken } from './utils.auth';
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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
  // console.log(user);

  // 3. create token and sent to the client
  const jwtPayload = {
    _id: user?._id as string,
    username: user.username,
    email: user.email,
    role: user.role,
  };

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

// change password
const changePassword = async (
  userData: JwtPayload,
  payload: { currentPassword: string; newPassword: string },
) => {
  // 01. checking if the user is exist
  const user = await User.isUserExists(userData.username);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, '', 'This user is not found !');
  }

  // 02. checking if the password is correct
  if (!(await User.isPasswordMatched(payload.currentPassword, user?.password)))
    throw new AppError(
      httpStatus.FORBIDDEN,
      `${user.role}'s Password do not matched`,
      '',
    );
  // 03 Check if the new password is different from the current password
  if (payload.currentPassword === payload.newPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      '',
      'Password change failed. Ensure the new password is unique and not among the last 2 used',
    );
    return null;
  }

  // 04 hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  // update password
  await User.findOneAndUpdate(
    {
      username: userData.username,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
    { new: true, runValidators: true },
  );
  return user;
};

export const authServices = {
  loginUser,
  changePassword,
};

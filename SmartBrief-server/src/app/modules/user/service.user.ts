/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TUser } from './interface.user';
import { User } from './mode.user';

const registerUser = async (payload: TUser) => {
  // create
  const register = await User.create(payload);
  return register;
};

export const userServices = {
  registerUser,
};

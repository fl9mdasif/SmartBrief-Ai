import { TUserRole } from './interface.auth';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Define a more accurate interface for your JWT payload
export interface TTokenPayload extends JwtPayload {
    _id: string;
    username: string;
    email: string;
    role: TUserRole;
    credits: number;
}

// create token - now accepts a more flexible payload
export const createToken = (
  jwtPayload: Partial<TTokenPayload>,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn, // this must be inside the options object
  });
};

// verify the token
export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret as string) as TTokenPayload;
};
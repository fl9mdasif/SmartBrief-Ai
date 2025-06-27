import jwt, { JwtPayload } from 'jsonwebtoken';

// create token
export const createToken = (
  jwtPayload: { username: string; role: 'user' | 'admin'; email: string },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

// verify the token
export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret as string) as JwtPayload;
};

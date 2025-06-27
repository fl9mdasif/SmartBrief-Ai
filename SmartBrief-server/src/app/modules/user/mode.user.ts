import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './interface.user';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser, UserModel>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      // select: 0,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      required: true,
    },

    passwordChangedAt: { type: Date },
  },
  { timestamps: true },
);

// hash the password
// hash the password
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;

  // Store hash in your password DB.

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// compare bcrypt password for auth
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

// Exclude password field when converting to JSON
userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.passwordChangedAt;
    delete ret.__v;
  },
});

// for auth
// find user exists
userSchema.statics.isUserExists = async function (name: string) {
  return await User.findOne({ username: name });
};

// jwt password time checking
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  // console.log(passwordChangedTimestamp, jwtIssuedTimestamp);
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>('User', userSchema);

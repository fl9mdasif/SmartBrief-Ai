import { Schema, model } from 'mongoose'; 
import bcrypt from 'bcrypt';
import config from '../../config'; 
import { TUser, UserModel } from './interface.auth';

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
      enum: ['user', 'admin', 'editor', 'reviewer'],
      // required: true,
      default: 'user', // Default role for new users
    },
    credits: {
      type: Number,
      // required: true,
      default: 5, // New users will start with 5 credits
    },
    passwordChangedAt: { type: Date },
  },
  { timestamps: true },
);

// hash the password
userSchema.pre('save', async function (next) {
  // `this` refers to the document being saved
  const user = this;

  // THIS IS THE FIX:
  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }

  // If the password IS modified, then proceed with hashing
  try {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds),
    );
    next();
  } catch (error) {
    return next(error as Error);
  }
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

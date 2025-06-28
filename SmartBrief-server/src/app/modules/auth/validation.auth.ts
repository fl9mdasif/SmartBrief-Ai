import { z } from 'zod';

export const loginValidationSchema = z.object({
  body: z.object({
    username: z.string({ required_error: 'username is required.' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    currentPassword: z.string({
      required_error: 'Old password is required',
    }),
    newPassword: z.string({ required_error: 'Password is required' }),
  }),
});

 
const userRegistrationValidation = z.object({
  body: z.object({
    username: z.string().min(1).max(50),
    email: z.string().email(),
    password: z.string().min(5),
    role: z.string().min(1).optional(), // Role is optional, default will be set in the model
    credits: z.number().min(0).default(5).optional(), // New users will start with 5 credits
  }),
});




export const authValidations = {
  loginValidationSchema,
  changePasswordValidationSchema,
  userRegistrationValidation
};

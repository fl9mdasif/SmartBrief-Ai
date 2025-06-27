import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { userControllers } from '../user/controller.user';
import { userZodValidationSchema } from '../user/validation.user';
import { authValidations } from './validation.auth';
import { authControllers } from './controller.auth';
import { USER_ROLE } from '../user/constant.user';
import auth from '../../middlewares/auth';

const router = express.Router();

// register a user
router.post(
  '/register',
  validateRequest(userZodValidationSchema.userRegistrationValidation),
  userControllers.registerUser,
);

// login a user
router.post(
  '/login',
  validateRequest(authValidations.loginValidationSchema),
  authControllers.loginUser,
);

router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(authValidations.changePasswordValidationSchema),
  authControllers.changePassword,
);
export const userRoute = router;

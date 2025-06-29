 
import express from 'express';
import validateRequest from '../../middlewares/validateRequest'; 
import { authValidations } from './validation.auth';
import { authControllers } from './controller.auth';
const router = express.Router();

// register a user
router.post(
  '/register',
  validateRequest(authValidations.userRegistrationValidation),
  authControllers.registerUser,
);

// login a user
router.post(
  '/login',
  validateRequest(authValidations.loginValidationSchema),
  authControllers.loginUser,
);



 
export const userRoute = router;

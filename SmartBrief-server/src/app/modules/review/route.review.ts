import express from 'express';
import { reviewController } from './controller.review';
import { reviewValidationSchema } from './validation.review';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';

const router = express.Router();
router.post(
  '/',
  auth('user'),
  validateRequest(reviewValidationSchema),
  reviewController.createReview,
);

export const reviewRouter = router;

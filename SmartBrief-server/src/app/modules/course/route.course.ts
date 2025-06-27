import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidation } from './validation.course';
import { courseControllers } from './controller.course';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/',
  auth('admin'),
  validateRequest(CourseValidation.CreateCourseValidationSchema),
  courseControllers.createCourse,
);

router.get('/best', courseControllers.findBestCourse);

router.put('/:courseId', auth('admin'), courseControllers.updateCourse);

router.get('/:courseId/reviews', courseControllers.getSingleCourseWithReview);
router.get('/', auth('admin'), courseControllers.getAllCourse);

export const courseRoute = router;

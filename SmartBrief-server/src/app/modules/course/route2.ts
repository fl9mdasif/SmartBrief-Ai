import express from 'express';
import { courseControllers } from './controller.course';

const router = express.Router();

router.get('/best', courseControllers.findBestCourse);

export const bestCourseRoute = router;

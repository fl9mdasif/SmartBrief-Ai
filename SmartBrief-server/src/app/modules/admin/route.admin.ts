import express from 'express';   
import { AdminControllers } from './controller.admin';
import catchAsync from '../../utils/catchAsync';
import auth from '../../middlewares/auth';

const router = express.Router();

// Get all users - ONLY ADMINS
router.get(
    '/users',
    auth('admin'),
    AdminControllers.getAllUsers
);

// Recharge user credits - ONLY ADMINS
router.patch(
    '/users/recharge-credits',
    auth('admin'),
    catchAsync(AdminControllers.rechargeUserCredits)
);
// Change user role - ONLY ADMINS
router.patch(
    '/users/change-role',
    auth('admin'),
    catchAsync(AdminControllers.changeUserRole)
);

export const AdminRoutes = router;
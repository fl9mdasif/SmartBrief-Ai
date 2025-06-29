import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status'; 
import { User } from '../auth/model.auth';
 
// 1. Get a list of all users
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        
        res.status(httpStatus.OK).json({
            success: true,
            message: 'Users retrieved successfully!',
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

// 2. Recharge credits for a specific user
const rechargeUserCredits = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, amount } = req.body;

        if (!userId || !amount || typeof amount !== 'number' || amount <= 0) {
            return res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                message: 'A valid userId and a positive amount are required.',
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $inc: { credits: amount } }, // Atomically increment credits
            { new: true, select: '-password' } // Return the updated doc without the password
        );

        if (!updatedUser) {
            return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'User not found.' });
        }

        res.status(httpStatus.OK).json({
            success: true,
            message: `Successfully added ${amount} credits to ${updatedUser.username}.`,
            data: updatedUser,
        });

    } catch (error) {
        next(error);
    }
};

export const AdminControllers = {
    getAllUsers,
    rechargeUserCredits,
};
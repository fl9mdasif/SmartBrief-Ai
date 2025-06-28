// app/middlewares/checkCredits.ts
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';// Adjust path to your user model // Assuming you have a custom error class
import { User } from '../modules/user/mode.user';
import AppError from '../errors/AppError';

export const checkCredits = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.user should be populated by your JWT authentication middleware
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND,'f', 'User not found!');
    }

    // Check if the user has enough credits
    if (user.credits < 1) {
      throw new AppError(httpStatus.FORBIDDEN,' f', 'Insufficient credits. Please recharge to continue.');
    }

    // Decrement the credit and save. Using $inc is efficient.
    user.credits -= 1;
    await user.save();

    // If everything is okay, proceed to the next handler (the summarization controller)
    next();
  } catch (error) {
    next(error); // Pass error to your global error handler
  }
};
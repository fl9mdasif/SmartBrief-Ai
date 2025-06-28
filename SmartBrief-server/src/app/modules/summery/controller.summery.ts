import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';// Adjust path if necessary
import { generateAISummary } from '../../utils/ai.service';
import { Summary } from './model.summery';
import { User } from '../auth/model.auth';

// Helper function to count words
const countWords = (str: string): number => {
  if (!str) return 0;
  return str.trim().split(/\s+/).length;
};

// 1. Create a new summary
const createSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prompt } = req.body;
    // @ts-ignore // Assuming your auth middleware attaches user to req
    const userId = req.user._id;

    if (!prompt) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Prompt text is required.',
      });
    }

    const summarizedText = await generateAISummary(prompt);

    const newSummary = await Summary.create({
      prompt,
      summarizedContent: summarizedText,
      wordCount: countWords(summarizedText),
      user: userId,
    });
    
    // Atomically decrement the user's credits and return the new value
    const updatedUser = await User.findByIdAndUpdate(userId, 
        { $inc: { credits: -1 } },
        { new: true } // This option returns the updated document
    );

    res.status(httpStatus.CREATED).json({
      success: true,
      message: 'Summary created successfully!',
      data: {
        summary: newSummary,
        // Send back the new credit count so the UI can update instantly
        updatedCredits: updatedUser?.credits 
      },
    });
  } catch (error) {
    next(error);
  }
};

// 2. Get all summaries for the logged-in user
const getUserSummaries = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const userId = req.user._id;
        const summaries = await Summary.find({ user: userId }).sort({ createdAt: -1 });

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Summaries retrieved successfully!',
            data: summaries,
        });
    } catch (error) {
        next(error);
    }
};


// 3. Delete a summary
const deleteSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const { _id: userId, role: userRole } = req.user;

        const summary = await Summary.findById(id);

        if (!summary) {
            return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Summary not found' });
        }

        // Check permissions
        if (summary.user.toString() !== userId.toString() && !['admin', 'editor'].includes(userRole)) {
            return res.status(httpStatus.FORBIDDEN).json({ success: false, message: 'You are not authorized to perform this action.' });
        }

        await Summary.findByIdAndDelete(id);

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Summary deleted successfully!',
        });
    } catch (error) {
        next(error);
    }
};


export const SummaryControllers = {
  createSummary,
  getUserSummaries,
  deleteSummary,
};
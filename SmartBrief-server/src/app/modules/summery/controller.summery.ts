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
// console.log(prompt, userId);
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


// Add this function inside your SummaryControllers object

const updateSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; // The ID of the summary to update
    const { prompt } = req.body; // The new, edited prompt from the user
    // @ts-ignore
    const { _id: userId, role: userRole } = req.user;

    if (!prompt) {
      return res.status(httpStatus.BAD_REQUEST).json({ success: false, message: 'A new prompt is required.' });
    }

    const existingSummary = await Summary.findById(id);

    if (!existingSummary) {
      return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Summary not found' });
    }

    // Permission Check: Ensure the user owns this summary
    if (existingSummary.user.toString() !== userId.toString() && userRole !== 'admin') {
      return res.status(httpStatus.FORBIDDEN).json({ success: false, message: 'You are not authorized to edit this summary.' });
    }

    // This action costs a credit, which is handled by the `checkCredits` middleware.
    
    // Generate the new summary content
    const newSummarizedText = await generateAISummary(prompt);

    // Update the existing document in the database
    const updatedSummaryData = {
      prompt,
      summarizedContent: newSummarizedText,
      wordCount: countWords(newSummarizedText),
    };

    const updatedSummary = await Summary.findByIdAndUpdate(id, updatedSummaryData, { new: true });

    // Decrement the user's credits
    const updatedUser = await User.findByIdAndUpdate(userId, 
        { $inc: { credits: -1 } },
        { new: true }
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Summary updated successfully!',
      data: {
        summary: updatedSummary,
        updatedCredits: updatedUser?.credits,
      },
    });
  } catch (error) {
    next(error);
  }
};
// NEW: This function handles manual edits and does NOT use a credit.
const manualEditSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { summarizedContent } = req.body; // It expects 'summarizedContent'
        // @ts-ignore
        const { _id: userId, role: userRole } = req.user;

        if (summarizedContent === undefined) {
             return res.status(httpStatus.BAD_REQUEST).json({ success: false, message: 'summarizedContent field is required.' });
        }
        
        const summaryToEdit = await Summary.findById(id);
        if (!summaryToEdit) {
            return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Summary not found' });
        }

        // Permission check: Owner or admin/editor can edit
        if (summaryToEdit.user.toString() !== userId.toString() && !['admin', 'editor'].includes(userRole)) {
            return res.status(httpStatus.FORBIDDEN).json({ success: false, message: 'You are not authorized to edit this summary.' });
        }

        const updatedSummaryData = {
            summarizedContent: summarizedContent,
            wordCount: countWords(summarizedContent),
        };
        
        const updatedSummary = await Summary.findByIdAndUpdate(id, updatedSummaryData, { new: true });

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Summary updated manually.',
            data: { summary: updatedSummary }, // No credit change to report
        });

    } catch (error) {
        next(error);
    }
};
const repromptSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { prompt } = req.body;
    // @ts-ignore
    const userId = req.user._id;

    if (!prompt) {
      return res.status(httpStatus.BAD_REQUEST).json({ success: false, message: 'A new prompt is required for re-prompting.' });
    }
    
    // (Permission checks could be added here if needed)

    const newSummarizedText = await generateAISummary(prompt);
    const updatedSummaryData = {
      prompt,
      summarizedContent: newSummarizedText,
      wordCount: countWords(newSummarizedText),
    };
    const updatedSummary = await Summary.findByIdAndUpdate(id, updatedSummaryData, { new: true });
    const updatedUser = await User.findByIdAndUpdate(userId, { $inc: { credits: -1 } }, { new: true });

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Summary re-prompted successfully!',
      data: { summary: updatedSummary, updatedCredits: updatedUser?.credits },
    });
  } catch (error) {
    next(error);
  }
};


// Don't forget to export it!
export const SummaryControllers = {
  createSummary,
  getUserSummaries,
  deleteSummary,
  updateSummary, // <-- Add this
  manualEditSummary, // <-- Add this for manual edits
  repromptSummary, // <-- Add this for re-prompting
};
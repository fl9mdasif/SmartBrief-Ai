import express from 'express';
import { checkCredits } from '../../middlewares/checkCredits';
import auth from '../../middlewares/auth';
import { SummaryControllers } from './controller.summery';
import catchAsync from '../../utils/catchAsync';
; // Your JWT auth middleware

const router = express.Router();

// Route to create a new summary
router.post(
  '/',
  auth('user', 'admin', 'editor', 'reviewer'), // Any logged-in user can create
  catchAsync(checkCredits),
  catchAsync(SummaryControllers.createSummary),
);

// Route to get a user's own summary history
router.get(
    '/',
    auth('user', 'admin', 'editor', 'reviewer'), // Any logged-in user can get their history
    SummaryControllers.getUserSummaries
);
router.patch(
    '/:id',
    auth( 'admin', 'editor'), // User must be logged in
    checkCredits, // This action costs 1 credit
    catchAsync(SummaryControllers.updateSummary)
)
// Route to delete a summary
router.delete(
    '/:id',
    auth('admin', 'editor'), // Reviewers cannot delete
    catchAsync(SummaryControllers.deleteSummary)
);
router.patch(
    '/:id/re-prompt', // New, specific path
    auth( 'admin', 'editor'),
    checkCredits, // This action costs 1 credit
    catchAsync(SummaryControllers.repromptSummary),
);

export const SummaryRoutes = router;
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { response } from '../../utils/sendResponse';
import { reviewService } from './service.review';

// create course
const createReview = catchAsync(async (req, res) => {
  const result = await reviewService.createReview(req.user, req.body);

  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

export const reviewController = {
  createReview,
};

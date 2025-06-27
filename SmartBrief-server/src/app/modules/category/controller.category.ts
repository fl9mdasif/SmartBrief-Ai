import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { categoryServices } from './service.category';
import { response } from '../../utils/sendResponse';

const createCategory = catchAsync(async (req, res) => {
  // console.log(req.user);
  const result = await categoryServices.createCategory(req.user, req.body);

  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const getAllCategory = catchAsync(async (req, res) => {
  const result = await categoryServices.getAllCategory();

  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Categories retrieved successfully',
    data: result,
  });
});

export const categoryControllers = {
  createCategory,
  getAllCategory,
};

// import { response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { response } from '../../utils/sendResponse';
import { userServices } from './service.user';

const registerUser = catchAsync(async (req, res) => {
  //   console.log(req.body);

  const result = await userServices.registerUser(req.body);

  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

export const userControllers = {
  registerUser,
};

import { JwtPayload } from 'jsonwebtoken';
import { User } from '../user/mode.user';
import { TReview } from './interface.review';
import { Review } from './model.review';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createReview = async (user: JwtPayload, payload: TReview) => {
  const isUser = await User.isUserExists(user.username);
  const userId = isUser?._id;

  const newReview = {
    ...payload,
    createdBy: userId,
  };
  const result = (await Review.create(newReview)).populate('createdBy');
  return result;
};

export const reviewService = {
  createReview,
};

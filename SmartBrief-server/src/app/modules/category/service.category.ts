import { JwtPayload } from 'jsonwebtoken';
import { TCategory } from './interface.category';
import { Category } from './model.category';
import { User } from '../user/mode.user';

const createCategory = async (user: JwtPayload, payload: TCategory) => {
  const isUser = await User.isUserExists(user.username);

  const userId = isUser?._id;

  const newCategory = {
    ...payload,
    createdBy: userId,
  };
  const result = await Category.create(newCategory);
  return result;
};

// get all category
const getAllCategory = async () => {
  const result = await Category.find().populate(
    'createdBy',
    '-password -createdAt -updatedAt',
  );
  return result;
};

export const categoryServices = {
  createCategory,
  getAllCategory,
};

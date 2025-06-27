import { TCourse } from './interface.course';
import { Course } from './model.course';
import { Review } from '../review/model.review';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/mode.user';
import { JwtPayload } from 'jsonwebtoken';

// create course
const createCourse = async (whichUser: JwtPayload, payload: TCourse) => {
  const user = await User.isUserExists(whichUser.username);
  const userId = user?._id;

  const newCourse = {
    ...payload,
    createdBy: userId,
  };

  const result = await Course.create(newCourse);

  return result;
};

// get all course
const getAllCourses = async (payload: Record<string, unknown>) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'startDate',
      sortOrder = 'asc',
      minPrice,
      maxPrice,
      tags,
      startDate,
      endDate,
      language,
      provider,
      durationInWeeks,
      level,
    } = payload;

    //  filter object based on query parameters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(String(minPrice));
      if (maxPrice) filter.price.$lte = parseFloat(String(maxPrice));
    }

    if (tags) filter['tags.name'] = { $regex: new RegExp(tags as string, 'i') };
    if (startDate) filter.startDate = startDate;
    if (endDate) filter.endDate = endDate;
    if (language)
      filter.language = { $regex: new RegExp(language as string, 'i') };
    if (provider)
      filter.provider = { $regex: new RegExp(provider as string, 'i') };
    if (durationInWeeks)
      filter.durationInWeeks = parseInt(String(durationInWeeks));
    if (level)
      filter['details.level'] = { $regex: new RegExp(level as string, 'i') };

    // sort order && sort by
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sort: Record<string, any> = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    // calculate skip value for pagination
    const skip = (parseInt(String(page)) - 1) * parseInt(String(limit));

    const result = await Course.find(filter)
      .populate('createdBy', '-password -createdAt -updatedAt')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(String(limit)));

    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw new Error(err);
  }
};

// getSingleCourseWithReview
const getSingleCourseWithReview = async (id: string) => {
  // console.log(id);

  const singleCourse = await Course.findById(id)
    .populate('createdBy', '-password -createdAt -updatedAt -__v')
    .lean();

  // get reviews
  const reviews = await Review.find({ courseId: id })
    .populate(
      'createdBy',
      '-password -createdAt -updatedAt -__v -passwordChangedAt',
    )
    .lean();
  // console.log(reviews);

  const courseWithReviews = { ...singleCourse, reviews: [...reviews] };
  // console.log( courseWithReviews);
  return courseWithReviews;
};

// find best course
const findBestCourse = async () => {
  // console.log(id);

  const bestCourse = await Course.aggregate([
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'courseId',
        as: 'reviews',
      },
    },
    {
      $project: {
        title: 1,
        instructor: 1,
        categoryId: 1,
        price: 1,
        tags: 1,
        startDate: 1,
        endDate: 1,
        language: 1,
        provider: 1,
        durationInWeeks: 1,
        details: 1,
        averageRating: { $avg: '$reviews.rating' },
        reviewCount: { $size: '$reviews' },
      },
    },
    {
      $sort: { averageRating: -1 },
    },
  ]);

  if (bestCourse.length > 0) {
    const result = bestCourse[0];
    return result;
  }
};

// update course
const updateCourse = async (id: string, updatedData: Partial<TCourse>) => {
  const { tags, details, ...courseRemainingData } = updatedData;

  // console.log(courseRemainingData);

  // Basic update primitive fields
  const updatedBasicCourseInfo = await Course.findOneAndUpdate(
    { _id: id },

    { $set: courseRemainingData },
    { upsert: true, new: true, runValidators: true },
  );

  if (!updatedBasicCourseInfo) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to update basic course',
      '',
    );
  }

  // Update non-primitive fields if available
  if (details) {
    const updatedDetails = await Course.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          'details.level': details.level,
          'details.description': details.description,
        },
      },
      { new: true, upsert: true, runValidators: true },
    );

    if (!updatedDetails) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to update details',
        '',
      );
    }
    return updatedDetails;
  }

  // dynamic Update preRequisiteCourse = tags
  if (tags && tags.length > 0) {
    // Filter out the deleted fields
    const deletedTags = tags
      .filter((el) => el.name && el.isDeleted)
      .map((el) => el.name);

    // Remove deleted Tags
    const deletedCourseTags = await Course.findByIdAndUpdate(
      id,
      {
        $pull: {
          tags: { name: { $in: deletedTags } },
        },
      },
      { new: true, runValidators: true },
    );

    if (!deletedCourseTags) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course', '');
    }

    // Filter out the new course fields
    const newPreTags = tags?.filter((el) => el.name && !el.isDeleted);

    // console.log(newPreTags);

    const newTags = await Course.findByIdAndUpdate(
      id,
      {
        $addToSet: { tags: { $each: newPreTags } },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      },
    );

    if (!newTags) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to update  dynamic course',
        '',
      );
    }
  }
  // result
  const result = await Course.findById(id).populate('createdBy');
  return result;
};

export const courseServices = {
  createCourse,
  getAllCourses,
  getSingleCourseWithReview,
  findBestCourse,
  updateCourse,
};

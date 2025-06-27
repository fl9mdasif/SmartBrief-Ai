import { Types } from 'mongoose';

export type TCourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

type TTag = {
  name: string;
  isDeleted: boolean;
};

type TCourseDetails = {
  level: string;
  description: string;
};

export type TCourse = {
  title: string;
  instructor: string;
  categoryId: Types.ObjectId;
  price: number;
  tags: TTag[];
  startDate: string;
  endDate: string;
  language: string;
  provider: string;
  durationInWeeks?: number;
  details: TCourseDetails;
  createdBy?: Types.ObjectId;
};

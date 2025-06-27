import z from 'zod';
import { CourseLevel } from './constant.course';

// Zod schema for the Tag object
const TagSchema = z.object({
  name: z.string(),
  isDeleted: z.boolean(),
});

// Zod schema for the CourseDetails object
const CourseDetailsSchema = z.object({
  level: z.enum([...CourseLevel] as [string, ...string[]]),
  description: z.string(),
});

// Zod schema for the Course object
const CreateCourseValidationSchema = z.object({
  body: z.object({
    title: z.string(),
    instructor: z.string(),
    categoryId: z.string(), // Assuming you're using strings as ObjectIds, adjust if needed
    price: z.number(),
    tags: z.array(TagSchema),
    startDate: z.string(),
    endDate: z.string(),
    language: z.string(),
    provider: z.string(),
    durationInWeeks: z.number().optional(),
    details: CourseDetailsSchema,
  }),
});

// update
// Zod schema for the Course object
const UpdateCourseValidationSchema = z.object({
  title: z.string().optional(),
  instructor: z.string().optional(),
  categoryId: z.string().optional(), // Assuming you're using strings as ObjectIds, adjust if needed
  price: z.number().optional(),
  tags: z.array(TagSchema).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  language: z.string().optional(),
  provider: z.string().optional(),
  durationInWeeks: z.number().optional(),
  details: CourseDetailsSchema.optional(),
});

export const CourseValidation = {
  CreateCourseValidationSchema,
  UpdateCourseValidationSchema,
};

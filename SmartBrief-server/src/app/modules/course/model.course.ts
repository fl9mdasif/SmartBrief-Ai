import { Schema, model } from 'mongoose';
import { TCourse } from './interface.course';
import { CourseLevel } from './constant.course';
import { calculateDurationInWeeks } from './utils.course';

const courseSchema = new Schema<TCourse>({
  title: {
    type: String,
    unique: true,
    required: true,
  },
  instructor: { type: String, required: true },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  price: { type: Number, required: true },
  tags: [
    {
      name: { type: String, required: true },
      isDeleted: { type: Boolean, required: true },
    },
  ],
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  language: { type: String, required: true },
  provider: { type: String, required: true },
  durationInWeeks: { type: Number },
  details: {
    level: {
      type: String,
      enum: {
        values: CourseLevel,
        message: '{VALUE} is not a valid gender',
      },
      required: true,
    },
    description: { type: String },
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

// Pre-hook to calculate durationInWeeks before saving
courseSchema.pre('save', function (next) {
  if (this.startDate && this.endDate) {
    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);

    // Calculate durationInWeeks using ceil function
    const durationInWeeks = calculateDurationInWeeks(startDate, endDate);

    this.durationInWeeks = durationInWeeks;
    // console.log(this);
  }
  next();
});

// Pre-save middleware
courseSchema.pre('findOneAndUpdate', async function (next) {
  const singleCourse = await this.model.findOne(this.getQuery());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const update: any = this.getUpdate();

  // Update the durationWeek field based on the document being updated
  if ('$set' in update) {
    const startDate = new Date(
      update?.$set?.startDate || singleCourse.startDate,
    );
    const endDate = new Date(update?.$set?.endDate || singleCourse.endDate);
    if (singleCourse && (startDate || endDate)) {
      const durationInWeeks = calculateDurationInWeeks(startDate, endDate);
      // console.log(durationInWeeks);
      singleCourse.durationInWeeks = durationInWeeks;
    }
  }
  // Save the document to persist the changes
  await singleCourse.save();
  next();
});

export const Course = model<TCourse>('Course', courseSchema);

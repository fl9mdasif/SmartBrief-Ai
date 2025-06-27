import { Schema, model } from 'mongoose';
import { TCategory } from './interface.category';

const categorySchema = new Schema<TCategory>({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

export const Category = model<TCategory>('Category', categorySchema);

import { Schema, model } from 'mongoose';
import { TSummary } from './interface.summery';

const summarySchema = new Schema<TSummary>(
  {
    prompt: {
      type: String,
      required: [true, 'Prompt text is required.'],
    },
    summarizedContent: {
      type: String,
      required: [true, 'Summarized content is required.'],
    },
    wordCount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['completed', 'failed'],
      default: 'completed',
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User', // This creates a reference to your User model
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  },
);

export const Summary = model<TSummary>('Summary', summarySchema);
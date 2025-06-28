import { Types } from 'mongoose';

export interface TSummary {
  prompt: string;
  summarizedContent: string;
  wordCount: number;
  status: 'completed' | 'failed';
  user: Types.ObjectId; // Reference to the User who owns this summary
}
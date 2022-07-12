import mongoose from 'mongoose';

export interface DailyMemoCreateDto {
  date: string;
  type: string;
  value: string;
  userId: mongoose.Types.ObjectId;
}

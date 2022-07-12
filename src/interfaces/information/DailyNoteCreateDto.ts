import mongoose from 'mongoose';

export interface DailyNoteCreateDto {
  date: string;
  type: string;
  value: string;
  userId: mongoose.Types.ObjectId;
}

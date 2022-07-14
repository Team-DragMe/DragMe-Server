import mongoose from 'mongoose';

export interface ScheduleCreateDto {
  date: string;
  title: string;
  categoryColorCode: string;
  userId: mongoose.Types.ObjectId;
  orderIndex: Number;
  isReschedule?: boolean;
  isRoutine?: boolean;
}

import mongoose from 'mongoose';

export interface ScheduleCreateDto {
  date: string;
  title: string;
  categoryColorCode: string;
  userId: string;
  orderIndex: Number;
  isReschedule?: boolean;
  isRoutine?: boolean;
  subSchedules?: mongoose.Types.ObjectId[];
}

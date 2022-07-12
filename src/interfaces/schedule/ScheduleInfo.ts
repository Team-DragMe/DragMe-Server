import mongoose from 'mongoose';

export interface ScheduleInfo {
  date: string;
  timeSets: object[];
  title: string;
  subSchedules: mongoose.Types.ObjectId[];
  categoryColorCode: string;
  userId: mongoose.Types.ObjectId;
  isCompleted: boolean;
  isReschedule: boolean;
  isRoutine: boolean;
  orderIndex: number;
}

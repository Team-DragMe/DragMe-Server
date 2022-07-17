import mongoose from 'mongoose';

export interface CreateTimeDto {
  scheduleId: mongoose.Types.ObjectId;
  isUsed: boolean;
  timeBlockNumbers: [number];
}

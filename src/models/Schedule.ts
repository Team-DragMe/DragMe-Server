import mongoose from 'mongoose';
import { ScheduleInfo } from '../interfaces/schedule/ScheduleInfo';

const ScheduleSchema = new mongoose.Schema(
  {
    date: {
      type: String,
    },
    estimatedTime: {
      type: [Number],
    },
    usedTime: {
      type: [Number],
    },
    title: {
      type: String,
      required: true,
    },
    subSchedules: {
      type: [mongoose.Types.ObjectId],
      ref: 'Schedule',
    },
    categoryColorCode: {
      type: String,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    isReschedule: {
      type: Boolean,
      default: false,
    },
    isRoutine: {
      type: Boolean,
      default: false,
    },
    orderIndex: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ScheduleInfo & mongoose.Document>(
  'Schedule',
  ScheduleSchema
);

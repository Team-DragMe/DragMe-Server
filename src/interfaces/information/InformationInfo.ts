import mongoose from 'mongoose';

export interface InformationInfo {
  date: string;
  type: string;
  value: string;
  userId: mongoose.Types.ObjectId;
}

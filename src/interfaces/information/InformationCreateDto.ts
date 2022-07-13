import mongoose from 'mongoose';

export interface InformationCreateDto {
  date: string;
  type: string;
  value: string;
  userId: mongoose.Types.ObjectId;
}

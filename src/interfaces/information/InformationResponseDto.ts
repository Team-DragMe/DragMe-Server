import mongoose from 'mongoose';

export interface InformationResponseDto {
  date: string;
  type: string;
  value: string;
  userId: mongoose.Types.ObjectId;
}

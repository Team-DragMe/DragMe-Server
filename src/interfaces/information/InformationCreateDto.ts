import mongoose from 'mongoose';

export interface InformationCreateDto {
  userId: string;
  date: string;
  type: string;
  value: string;
}

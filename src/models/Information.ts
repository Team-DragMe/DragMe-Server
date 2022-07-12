import mongoose from 'mongoose';
import { InformationInfo } from '../interfaces/information/InformationInfo';

const InformationSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    value: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<InformationInfo & mongoose.Document>(
  'Information',
  InformationSchema
);

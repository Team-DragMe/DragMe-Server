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
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
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

import mongoose from 'mongoose';
import { DailyMemoCreateDto } from '../interfaces/information/DailyMemoCreateDto';
import Information from '../models/Information';

const createDailyMemo = async (
  dailyMemoCreateDto: DailyMemoCreateDto
): Promise<void> => {
  try {
    const userId = '62cd6eb82b6b4e92c7fc08f1'; // 임시 구현
    dailyMemoCreateDto.userId = new mongoose.Types.ObjectId(userId); // 명시적으로 결정

    const isMemo = await Information.find({
      date: dailyMemoCreateDto.date,
      type: dailyMemoCreateDto.type,
    });
    if (isMemo.length === 0) {
      const dailyNote = new Information(dailyMemoCreateDto);
      await dailyNote.save();
    } else {
      await Information.findOneAndUpdate(
        {
          $and: [
            { userId: dailyMemoCreateDto.userId },
            { date: dailyMemoCreateDto.date },
          ],
        },
        {
          value: dailyMemoCreateDto.value,
        },
        { new: true }
      );
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export default { createDailyMemo };

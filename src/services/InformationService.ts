import mongoose from 'mongoose';
import { DailyNoteCreateDto } from '../interfaces/information/DailyNoteCreateDto';
import Information from '../models/Information';

const createDailyNote = async (
  dailyNoteCreateDto: DailyNoteCreateDto
): Promise<void> => {
  try {
    const userId = '62cd6eb82b6b4e92c7fc08f1'; // 임시 구현
    dailyNoteCreateDto.userId = new mongoose.Types.ObjectId(userId); // 명시적으로 결정

    const isMemo = await Information.find({
      date: dailyNoteCreateDto.date,
      type: dailyNoteCreateDto.type,
    });
    if (isMemo.length === 0) {
      const dailyNote = new Information(dailyNoteCreateDto);
      await dailyNote.save();
    } else {
      await Information.findOneAndUpdate(
        {
          $and: [
            { userId: dailyNoteCreateDto.userId },
            { date: dailyNoteCreateDto.date },
          ],
        },
        {
          value: dailyNoteCreateDto.value,
        },
        { new: true }
      );
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export default { createDailyNote };

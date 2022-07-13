import mongoose from 'mongoose';
import { InformationCreateDto } from '../interfaces/information/InformationCreateDto';
import { InformationResponseDto } from '../interfaces/information/InformationResponseDto';
import Information from '../models/Information';

const createDailyMemo = async (
  informationCreateDto: InformationCreateDto
): Promise<void> => {
  try {
    const userId = '62cd6eb82b6b4e92c7fc08f1'; // 임시 구현
    informationCreateDto.userId = new mongoose.Types.ObjectId(userId); // 명시적으로 결정
    informationCreateDto.type = 'memo';
    const isMemo = await Information.find({
      date: informationCreateDto.date,
      type: 'memo',
    });
    if (isMemo.length === 0) {
      const dailyNote = new Information(informationCreateDto);
      await dailyNote.save();
    } else {
      await Information.findOneAndUpdate(
        {
          $and: [
            { userId: informationCreateDto.userId },
            { date: informationCreateDto.date },
          ],
        },
        {
          value: informationCreateDto.value,
        },
        { new: true }
      );
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getDailyInformation = async (
  date: string
): Promise<InformationResponseDto> => {
  try {
    const emoji = await Information.findOne({
      $and: [{ date: date }, { type: 'emoji' }],
    });
    const dailyGoal = await Information.findOne({
      $and: [{ date: date }, { type: 'dailyGoal' }],
    });
    const memo = await Information.findOne({
      $and: [{ date: date }, { type: 'memo' }],
    });

    let data: {
      emoji: string | null;
      dailyGoal: string | null;
      memo: string | null;
    } = {
      emoji: null,
      dailyGoal: null,
      memo: null,
    };

    if (emoji) {
      data.emoji = emoji.value;
    }
    if (dailyGoal) {
      data.dailyGoal = dailyGoal.value;
    }
    if (memo) {
      data.memo = memo.value;
    }
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createEmoji = async (
  informationCreateDto: InformationCreateDto
): Promise<void> => {
  try {
    const userId = '62cd6eb82b6b4e92c7fc08f1'; // 임시 구현
    informationCreateDto.userId = new mongoose.Types.ObjectId(userId); // 명시적으로 결정
    informationCreateDto.type = 'emoji';

    const isEmoji = await Information.find({
      date: informationCreateDto.date,
      type: 'emoji',
    });
    if (isEmoji.length === 0) {
      const newEmoji = new Information(informationCreateDto);
      await newEmoji.save();
    } else {
      await Information.findOneAndUpdate(
        {
          $and: [
            { userId: informationCreateDto.userId },
            { date: informationCreateDto.date },
          ],
        },
        {
          value: informationCreateDto.value,
        },
        { new: true }
      );
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export default { createDailyMemo, getDailyInformation, createEmoji };

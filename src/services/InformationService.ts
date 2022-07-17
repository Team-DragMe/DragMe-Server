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

const createDailyGoal = async (
  informationCreateDto: InformationCreateDto
): Promise<void> => {
  try {
    // 특정 날짜, 유저, 타입과 일치하는 information이 존재하는지 탐색
    const existingDailyGoals = await Information.find({
      userId: informationCreateDto.userId,
      date: informationCreateDto.date,
      type: informationCreateDto.type,
    });
    if (existingDailyGoals.length === 0) {
      // 존재하지 않는 경우, 새로운 information 객체 생성
      const newDailyGoal = new Information(informationCreateDto);
      await newDailyGoal.save();
    } else {
      // 존재하는 경우, 기존의 information 객체에 정보 업데이트
      await Information.findByIdAndUpdate(
        existingDailyGoals[0]._id,
        informationCreateDto
      );
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  createDailyMemo,
  getDailyInformation,
  createEmoji,
  createDailyGoal,
};

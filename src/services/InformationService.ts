import mongoose from 'mongoose';
import { InformationCreateDto } from '../interfaces/information/InformationCreateDto';
import { DailyInformationResponseDto } from '../interfaces/information/DailyInformationResponseDto';
import Information from '../models/Information';
import { InformationResponseDto } from '../interfaces/information/InformationResponseDto';
import { calculateDaysOfWeek } from '../modules/calculateDaysOfWeek';

const createInformation = async (
  informationCreateDto: InformationCreateDto
): Promise<void> => {
  try {
    // 특정 날짜, 유저, 타입과 일치하는 information이 존재하는지 탐색
    const existingInformation = await Information.findOne({
      userId: informationCreateDto.userId,
      date: informationCreateDto.date,
      type: informationCreateDto.type,
    });
    if (!existingInformation) {
      // 존재하지 않는 경우, 새로운 information 객체 생성
      const newDailyGoal = new Information(informationCreateDto);
      await newDailyGoal.save();
    } else {
      // 존재하는 경우, 기존의 information 객체에 정보 업데이트
      await Information.findByIdAndUpdate(
        existingInformation._id,
        informationCreateDto
      );
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getDailyInformation = async (
  date: string
): Promise<DailyInformationResponseDto> => {
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

    let data: DailyInformationResponseDto = {
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

const getMonthlyGoal = async (
  date: string,
  userId: mongoose.Types.ObjectId
): Promise<InformationResponseDto> => {
  const dateRegex = date.substring(0, 7);
  try {
    const findMonthlyGoal = await Information.find({
      $and: [
        {
          userId: userId,
        },
        {
          date: { $regex: dateRegex },
        },
        {
          type: 'monthlyGoal',
        },
      ],
    });
    const data: InformationResponseDto = {
      date: findMonthlyGoal[0].date,
      type: findMonthlyGoal[0].type,
      value: findMonthlyGoal[0].value,
    };
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getWeeklyEmojis = async (
  userId: string,
  startDate: string,
  endDate: string
): Promise<InformationResponseDto[]> => {
  try {
    const daysOfWeek: string[] = calculateDaysOfWeek(startDate, endDate);
    const weeklyEmojis = await Promise.all(
      daysOfWeek.map(async (day: string) => {
        const emojiOfDay = await Information.findOne({
          // 특정 유저, 날짜의 이모지는 하나만 존재하므로 findOne을 사용해 배열이 아니라 객체만 받아옴
          userId: userId,
          date: day,
          type: 'emoji',
        });
        let emojiResponse: InformationResponseDto;
        if (emojiOfDay) {
          emojiResponse = {
            date: emojiOfDay.date,
            type: emojiOfDay.type,
            value: emojiOfDay.value,
          };
        } else {
          // 객체가 null인 경우에도 response type은 InformationResponseDto이므로, 형식을 맞춰줌
          emojiResponse = {
            date: day,
            type: '',
            value: '',
          };
        }
        return emojiResponse;
      })
    );
    return weeklyEmojis;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getWeeklyGoal = async (
  date: string
): Promise<InformationResponseDto[]> => {
  try {
    const initWeeklyGoalArray = [
      'weeklyGoal0',
      'weeklyGoal1',
      'weeklyGoal2',
      'weeklyGoal3',
      'weeklyGoal4',
      'weeklyGoal5',
      'weeklyGoal6',
    ];
    const weeklyGoalArray = await Promise.all(
      initWeeklyGoalArray.map(async (weeklyGoal: any) => {
        const getWeeklyGoal = await Information.findOne({
          date: date,
          type: weeklyGoal,
        });
        let weeklyGoalResponse: InformationResponseDto;
        if (getWeeklyGoal) {
          weeklyGoalResponse = {
            date: getWeeklyGoal.date,
            type: getWeeklyGoal.type,
            value: getWeeklyGoal.value,
          };
        } else {
          // 객체가 null인 경우에도 response type은 InformationResponseDto이므로, 형식을 맞춰줌
          weeklyGoalResponse = {
            date: date,
            type: weeklyGoal,
            value: '',
          };
        }
        return weeklyGoalResponse;
      })
    );
    return weeklyGoalArray;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export default {
  createInformation,
  getDailyInformation,
  getMonthlyGoal,
  getWeeklyEmojis,
  getWeeklyGoal,
};

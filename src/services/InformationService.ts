import { InformationCreateDto } from '../interfaces/information/InformationCreateDto';
import { InformationResponseDto } from '../interfaces/information/InformationResponseDto';
import Information from '../models/Information';

const createInformation = async (
  informationCreateDto: InformationCreateDto
): Promise<void> => {
  try {
    // 특정 날짜, 유저, 타입과 일치하는 information이 존재하는지 탐색
    const existingInformation = await Information.find({
      userId: informationCreateDto.userId,
      date: informationCreateDto.date,
      type: informationCreateDto.type,
    });
    if (existingInformation.length === 0) {
      // 존재하지 않는 경우, 새로운 information 객체 생성
      const newDailyGoal = new Information(informationCreateDto);
      await newDailyGoal.save();
    } else {
      // 존재하는 경우, 기존의 information 객체에 정보 업데이트
      await Information.findByIdAndUpdate(
        existingInformation[0]._id,
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

    let data: InformationResponseDto = {
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

const getMonthlyGoal = async (date: string) => {
  const dateRegex = date.substr(0, 7);
  try {
    const findMonthlyGoal = await Information.find({
      $and: [
        {
          date: { $regex: dateRegex },
        },
        {
          type: 'monthlyGoal',
        },
      ],
    });

    const data = {
      value: findMonthlyGoal[0].value,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export default {
  createInformation,
  getDailyInformation,
  getMonthlyGoal,
};

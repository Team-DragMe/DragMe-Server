import mongoose from 'mongoose';
import Schedule from '../models/Schedule';
import { ScheduleCreateDto } from '../interfaces/schedule/ScheduleCreateDto';
import { ScheduleListGetDto } from '../interfaces/schedule/ScheduleListGetDto';

const createSchedule = async (
  scheduleCreateDto: ScheduleCreateDto
): Promise<void> => {
  try {
    // 이미 존재하는 계획블록 조회 (orderIndex로 정렬)
    const existingSchedules = await Schedule.find({
      date: scheduleCreateDto.date,
      userId: scheduleCreateDto.userId,
    }).sort({ orderIndex: 1 });

    // 새로 생성할 계획블록의 index 계산
    let newIndex;
    if (existingSchedules.length === 0) {
      // 이미 존재하는 계획블록이 없을 경우, 해당 날짜의 첫 번째 블록
      newIndex = 1024;
    } else {
      // 계획블록이 이미 존재하는 경우, 기존 존재하는 계획블록의 마지막 index + 1024로 설정
      newIndex = existingSchedules[existingSchedules.length - 1].orderIndex;
      newIndex += 1024;
    }

    // scheduleCreateDto에 orderIndex 삽입
    scheduleCreateDto.orderIndex = newIndex;

    // scheduleCreateDto를 바탕으로 새로운 계획블록 생성
    const schedule = new Schedule(scheduleCreateDto);
    await schedule.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const dayReschedule = async (date: string): Promise<void> => {
  try {
    //계획블록 조회
    const scheduleId = new mongoose.Types.ObjectId('62cd879d1f0329b6e236522b');

    //계획블록 id를 찾아서 isReschedule true로 전환
    await Schedule.findOneAndUpdate(
      {
        _id: scheduleId,
      },
      {
        isReschedule: true,
      },
      { new: true }
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getDailySchedules = async (
  date: string,
  userId: mongoose.Types.ObjectId
): Promise<ScheduleListGetDto> => {
  try {
    const dailySchedules = await Schedule.find({
      date: date,
      userId: userId,
    }).sort({ orderIndex: 1 });

    return { schedules: dailySchedules };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  createSchedule,
  dayReschedule,
  getDailySchedules,
};

import mongoose from 'mongoose';
import Schedule from '../models/Schedule';
import { ScheduleCreateDto } from '../interfaces/schedule/ScheduleCreateDto';
import { ScheduleListGetDto } from '../interfaces/schedule/ScheduleListGetDto';
import { RescheduleListGetDto } from '../interfaces/schedule/RescheduleListGetDto';
import { ScheduleUpdateDto } from '../interfaces/schedule/ScheduleUpdateDto';
import { ScheduleInfo } from '../interfaces/schedule/ScheduleInfo';

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

const dayReschedule = async (
  scheduleId: mongoose.Types.ObjectId
): Promise<ScheduleInfo | null> => {
  try {
    //계획블록 id를 찾아서 isReschedule true로 전환, 시간 데이터 삭제
    const delaySchedule = await Schedule.findOneAndUpdate(
      {
        _id: scheduleId,
      },
      {
        $set: { isReschedule: true, timeSets: [] },
      },
      { new: true }
    );
    return delaySchedule;
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

const getReschedules = async (
  userId: mongoose.Types.ObjectId
): Promise<RescheduleListGetDto> => {
  try {
    const delaySchedules = await Schedule.find({
      userId: userId,
      isReschedule: true,
    }).sort({ orderIndex: 1 });

    return { schedules: delaySchedules };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const updateScheduleTitle = async (
  scheduleId: mongoose.Types.ObjectId,
  scheduleUpdateDto: ScheduleUpdateDto
): Promise<ScheduleInfo | null> => {
  try {
    const updatedSchedule = await Schedule.findOneAndUpdate(
      {
        _id: scheduleId,
      },
      {
        title: scheduleUpdateDto.title,
      },
      { new: true }
    );

    return updatedSchedule;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createRoutine = async (
  userId: mongoose.Types.ObjectId,
  scheduleId: mongoose.Types.ObjectId
): Promise<ScheduleInfo | null> => {
  try {
    // 자주 사용하는 계획으로 등록 할 원본 계획블록 find
    const originalSchedule = await Schedule.findById(scheduleId);
    console.log(originalSchedule);
    if (!originalSchedule) {
      // scheduleId에 해당하는 원본 계획블록이 없는 경우, null을 return
      return originalSchedule;
    }

    // 자주 사용하는 계획 블록 내에서의 orderIndex 계산
    const existingRoutines = await Schedule.find({
      isRoutine: true,
      userId: userId,
    }).sort({ orderIndex: 1 });

    // 새로 생성할 계획블록의 index 계산
    let newIndex;
    if (existingRoutines.length === 0) {
      // 이미 존재하는 계획블록이 없을 경우, 해당 날짜의 첫 번째 블록
      newIndex = 1024;
    } else {
      // 계획블록이 이미 존재하는 경우, 기존 존재하는 계획블록의 마지막 index + 1024로 설정
      newIndex = existingRoutines[existingRoutines.length - 1].orderIndex;
      newIndex += 1024;
    }

    // 새로운 routine 생성
    const newSchedule: ScheduleCreateDto = {
      date: '',
      title: originalSchedule.title,
      categoryColorCode: originalSchedule.categoryColorCode,
      userId: originalSchedule.userId,
      orderIndex: newIndex,
      isRoutine: true,
    };
    const newRoutine = new Schedule(newSchedule);
    await newRoutine.save();

    return newRoutine;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  createSchedule,
  dayReschedule,
  getDailySchedules,
  getReschedules,
  updateScheduleTitle,
  createRoutine,
};

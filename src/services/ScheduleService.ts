import mongoose from 'mongoose';
import Schedule from '../models/Schedule';
import { ScheduleCreateDto } from '../interfaces/schedule/ScheduleCreateDto';
import { ScheduleListGetDto } from '../interfaces/schedule/ScheduleListGetDto';
import { RescheduleListGetDto } from '../interfaces/schedule/RescheduleListGetDto';
import { ScheduleUpdateDto } from '../interfaces/schedule/ScheduleUpdateDto';
import { ScheduleInfo } from '../interfaces/schedule/ScheduleInfo';
import { calculateOrderIndex } from '../modules/calculateOrderIndex';

const createSchedule = async (
  scheduleCreateDto: ScheduleCreateDto
): Promise<void> => {
  try {
    // 특정 날짜의 계획블록 영억 내에서의 orderIndex 계산
    const existingSchedules = await Schedule.find({
      date: scheduleCreateDto.date,
      userId: scheduleCreateDto.userId,
    }).sort({ orderIndex: 1 });
    const newIndex = calculateOrderIndex(existingSchedules);

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
    const newIndex = calculateOrderIndex(existingRoutines);

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

const getRoutines = async (
  userId: mongoose.Types.ObjectId
): Promise<ScheduleListGetDto> => {
  try {
    const routines = await Schedule.find({
      userId: userId,
      isRoutine: true,
    }).sort({ orderIndex: 1 });

    return { schedules: routines };
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
  getRoutines,
};

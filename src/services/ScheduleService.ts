import mongoose from 'mongoose';
import Schedule from '../models/Schedule';
import { ScheduleCreateDto } from '../interfaces/schedule/ScheduleCreateDto';
import { ScheduleListGetDto } from '../interfaces/schedule/ScheduleListGetDto';
import { RescheduleListGetDto } from '../interfaces/schedule/RescheduleListGetDto';
import { ScheduleUpdateDto } from '../interfaces/schedule/ScheduleUpdateDto';
import { ScheduleInfo } from '../interfaces/schedule/ScheduleInfo';
import { calculateOrderIndex } from '../modules/calculateOrderIndex';
import { TimeDto } from '../interfaces/schedule/TimeDto';
import { SubScheduleIdTitleListDto } from '../interfaces/schedule/SubScheduleIdTitleListDto';
import _ from 'lodash';
import { calculateDaysOfWeek } from '../modules/calculateDaysOfWeek';

const createSchedule = async (
  scheduleCreateDto: ScheduleCreateDto
): Promise<void> => {
  try {
    // 특정 날짜의 계획블록 영역 내에서의 orderIndex 계산
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

const deleteSchedule = async (scheduleId: string): Promise<void | null> => {
  try {
    // 삭제할 계획블록 조회
    const checkDeleteSchedule = await Schedule.findById(scheduleId).populate({
      path: 'subSchedules',
      model: 'Schedule',
    });

    if (!checkDeleteSchedule) {
      return null;
    } else {
      const existingDeleteSubSchedule = checkDeleteSchedule.subSchedules;
      if (existingDeleteSubSchedule.length !== 0) {
        await Schedule.deleteMany({ _id: { $in: existingDeleteSubSchedule } }); // 상위 계획이 하위 계획도 있을 경우 하위계획 삭제
        await Schedule.findByIdAndDelete(scheduleId); // 상위 계획 삭제
      } else {
        // 상위 계획인지, 하위 계획인지 판별
        const isParentSchedule = await Schedule.find({
          subSchedules: scheduleId,
        });

        if (isParentSchedule.length !== 0) {
          // 하위계획일 경우 삭제 상위계획 subSchdule[]에 포함된 id 삭제
          await Schedule.findByIdAndUpdate(
            {
              _id: isParentSchedule[0]._id,
            },
            {
              $pull: { subSchedules: scheduleId },
            }
          );
        }
        await Schedule.findByIdAndDelete(scheduleId); // 상위 계획, 혹은 하위 계획 삭제
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const completeSchedule = async (
  scheduleId: mongoose.Types.ObjectId
): Promise<ScheduleInfo | null> => {
  try {
    // scheduleId로 계획블록 조회
    const checkCompleteSchedule = await Schedule.findById(scheduleId);
    if (!checkCompleteSchedule) {
      return null;
    } else {
      if (checkCompleteSchedule.isCompleted === true) {
        await Schedule.findOneAndUpdate(
          {
            _id: scheduleId,
          },
          {
            $set: { isCompleted: false, usedTime: [] },
          },
          { new: true }
        );
      } else {
        await Schedule.findOneAndUpdate(
          {
            _id: scheduleId,
          },
          {
            isCompleted: true,
          },
          { new: true }
        );
      }
      return checkCompleteSchedule;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createTime = async (
  scheduleId: mongoose.Types.ObjectId,
  timeDto: TimeDto
): Promise<ScheduleInfo | null> => {
  try {
    const createScheduleTime = await Schedule.findById(scheduleId);
    if (!createScheduleTime) {
      return null;
    } else {
      if (timeDto.isUsed === false) {
        await Schedule.findByIdAndUpdate(
          {
            _id: scheduleId,
          },
          {
            $push: { estimatedTime: { $each: timeDto.timeBlockNumbers } },
          },
          {
            new: true,
          }
        );
      } else {
        await Schedule.findByIdAndUpdate(
          {
            _id: scheduleId,
          },
          {
            $push: { usedTime: { $each: timeDto.timeBlockNumbers } },
          },
          {
            new: true,
          }
        );
      }
    }
    return createScheduleTime;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteTime = async (
  scheduleId: mongoose.Types.ObjectId,
  timeDto: TimeDto
): Promise<ScheduleInfo | null> => {
  try {
    const deleteScheduleTime = await Schedule.findById(scheduleId);
    if (!deleteScheduleTime) {
      return null;
    } else {
      if (timeDto.isUsed === false) {
        await Schedule.findByIdAndUpdate(
          {
            _id: scheduleId,
          },
          {
            $pull: { estimatedTime: { $in: timeDto.timeBlockNumbers } },
          },
          {
            new: true,
          }
        );
      } else {
        await Schedule.findByIdAndUpdate(
          {
            _id: scheduleId,
          },
          {
            $pull: { usedTime: { $in: timeDto.timeBlockNumbers } },
          },
          {
            new: true,
          }
        );
      }
    }
    return deleteScheduleTime;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const dayReschedule = async (
  scheduleId: mongoose.Types.ObjectId
): Promise<ScheduleInfo | null> => {
  try {
    // 계획블록의 isReschedule true로 전환, 시간 데이터 삭제
    const delaySchedule = await Schedule.findOneAndUpdate(
      {
        _id: scheduleId,
      },
      {
        $set: { isReschedule: true, timeSets: [] },
      },
      { new: true }
    );

    if (!delaySchedule) {
      return null;
    } else {
      // 하위 계획블록도 동일하게 처리
      for (const delaySubSchedule of delaySchedule.subSchedules) {
        await Schedule.findOneAndUpdate(
          {
            _id: delaySubSchedule._id,
          },
          {
            $set: { isReschedule: true, timeSets: [] },
          },
          { new: true }
        );
      }
    }
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

const getSubSchedules = async (
  scheduleId: string
): Promise<ScheduleListGetDto | null | undefined> => {
  try {
    // 상위 계획 조회
    const parentSchedule = await Schedule.findById(scheduleId).populate({
      path: 'subSchedules',
      model: 'Schedule',
    });
    if (!parentSchedule) {
      return null;
    }

    const childSchedules = await Promise.all(
      parentSchedule.subSchedules.map((SubSchedule: any) => {
        const result = SubSchedule;
        return result;
      })
    );

    // 하위 계획 orderIndex 기준으로 정렬
    childSchedules.sort(function (
      childSchedule: ScheduleInfo,
      anotherChildSchedule: ScheduleInfo
    ) {
      if (childSchedule.orderIndex > anotherChildSchedule.orderIndex) {
        return 1;
      }
      if (childSchedule.orderIndex < anotherChildSchedule.orderIndex) {
        return -1;
      }
      return 0;
    });

    return { schedules: childSchedules };
  } catch (error) {
    console.log(error);
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
    const originalSchedule = await Schedule.findById(scheduleId).populate({
      path: 'subSchedules',
      model: 'Schedule',
    });
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
      subSchedules: [],
    };

    // 원본 계획블록의 하위 계획들을 복사해 newSubSchedules 생성
    const newSubSchedules = await Promise.all(
      originalSchedule.subSchedules.map((originalSubSchedule: any) => {
        const result = {
          date: '',
          title: originalSubSchedule.title,
          categoryColorCode: originalSubSchedule.categoryColorCode,
          userId: originalSubSchedule.userId,
          orderIndex: originalSubSchedule.orderIndex,
          isRoutine: true,
        };
        return result;
      })
    );

    // newSubSchedules 배열을 돌면서 후속 처리 진행
    for (const newSubSchedule of newSubSchedules) {
      const newSubRoutine = new Schedule(newSubSchedule); // Schedule 객체인 newSubRoutine 생성
      await newSubRoutine.save(); // 생성된 newSubRoutine을 db에 저장
      newSchedule.subSchedules?.push(newSubRoutine._id); // 생성된 newSubRoutine의 _id를 newSchedule의 subSchedule 배열에 삽입
    }

    const newRoutine = new Schedule(newSchedule); // 하위 계획의 후속처리까지 완료된 새로 생성된 자주 사용하는 계획을 Schedule 객체로 생성
    await newRoutine.save(); // 생성된 newRoutine을 db에 저장

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

const rescheduleDay = async (
  scheduleId: mongoose.Types.ObjectId,
  date: string
): Promise<ScheduleInfo | null> => {
  try {
    // 계획블록의 isReschedule false로 전환, date 지정
    const moveBackSchedule = await Schedule.findOneAndUpdate(
      {
        _id: scheduleId,
      },
      {
        $set: { isReschedule: false, date: date },
      },
      { new: true }
    );

    if (!moveBackSchedule) {
      return null;
    } else {
      // 하위 계획블록도 동일하게 처리
      for (const moveBackSubSchedule of moveBackSchedule.subSchedules) {
        await Schedule.findOneAndUpdate(
          {
            _id: moveBackSubSchedule._id,
          },
          {
            $set: { isReschedule: false, date: date },
          },
          { new: true }
        );
      }
    }
    return moveBackSchedule;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const routineDay = async (
  userId: mongoose.Types.ObjectId,
  scheduleId: mongoose.Types.ObjectId,
  date: string
): Promise<ScheduleInfo | null> => {
  try {
    // 계획표로 이동할 자주 사용하는 계획블록 find
    const moveRoutineToSchedule = await Schedule.findById(scheduleId).populate({
      path: 'subSchedules',
      model: 'Schedule',
    });
    if (!moveRoutineToSchedule) {
      // scheduleId에 해당하는 원본 계획블록이 없는 경우, null을 return
      return moveRoutineToSchedule;
    }

    // 계획표 내에서 orderIndex 계산
    const existingSchedules = await Schedule.find({
      date: date,
      userId: userId,
    }).sort({ orderIndex: 1 });
    const newIndex = calculateOrderIndex(existingSchedules);
    // 새로운 계획블록 생성
    const newSchedule: ScheduleCreateDto = {
      date: date,
      title: moveRoutineToSchedule.title,
      categoryColorCode: moveRoutineToSchedule.categoryColorCode,
      userId: moveRoutineToSchedule.userId,
      orderIndex: newIndex,
      isRoutine: false,
      subSchedules: [],
    };

    // 자주 사용하는 계획블록의 하위 계획들을 복사해 newSubSchedules 생성
    const newSubSchedules = await Promise.all(
      moveRoutineToSchedule.subSchedules.map((RoutineSubSchedule: any) => {
        const result = {
          date: date,
          title: RoutineSubSchedule.title,
          categoryColorCode: RoutineSubSchedule.categoryColorCode,
          userId: RoutineSubSchedule.userId,
          orderIndex: RoutineSubSchedule.orderIndex,
          isRoutine: false,
        };
        return result;
      })
    );
    // newSubSchedules 배열을 돌면서 후속 처리 진행
    for (const newSubSchedule of newSubSchedules) {
      const newSubFromRoutine = new Schedule(newSubSchedule); // Schedule 객체인 newSubFromRoutine 생성
      await newSubFromRoutine.save(); // 생성된 newSubFromRoutine을 db에 저장
      newSchedule.subSchedules?.push(newSubFromRoutine._id); // 생성된 newSubFromRoutine의 _id를 newSchedule의 subSchedule 배열에 삽입
    }

    const makeNewSchedule = new Schedule(newSchedule); // 하위 계획의 후속처리까지 완료된 새로 생성된 자주 사용하는 계획을 Schedule 객체로 생성
    await makeNewSchedule.save(); // 생성된 newRoutine을 db에 저장
    return makeNewSchedule;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateScheduleOrder = async (
  scheduleId: string,
  movedScheduleArray: string[]
): Promise<ScheduleInfo | null> => {
  // 순서 변경 이후 상태의 계획블록 ID들의 배열에서 변경된 계획블록 탐색
  let movedScheduleIndex;
  movedScheduleArray.forEach((movedScheduleId: string, index: number) => {
    if (movedScheduleId === scheduleId) {
      movedScheduleIndex = index;
    }
  });

  try {
    // 새로운 orderIndex 계산
    let previousSchedule;
    let nextSchedule;
    let newOrderIndex;
    if (movedScheduleIndex === 0) {
      // 이동 후 계획블록이 영역의 맨 위에 위치할 때 : 기존 맨 위의 orderIndex / 2
      nextSchedule = await Schedule.findById(
        movedScheduleArray[movedScheduleIndex + 1]
      );
      newOrderIndex = nextSchedule!.orderIndex / 2; // nullable 제거 위해 타입 단언
    } else if (movedScheduleIndex === movedScheduleArray.length - 1) {
      // 이동 후 계획블록이 영역의 맨 아래에 위치할 때 : 기존 맨 아래의 orderIndex + 1024
      previousSchedule = await Schedule.findById(
        movedScheduleArray[movedScheduleIndex - 1]
      );
      newOrderIndex = previousSchedule!.orderIndex + 1024;
    } else if (movedScheduleIndex) {
      // undefined 방지 위해 else if 안에서 진행
      previousSchedule = await Schedule.findById(
        movedScheduleArray[movedScheduleIndex - 1]
      );
      nextSchedule = await Schedule.findById(
        movedScheduleArray[movedScheduleIndex + 1]
      );
      newOrderIndex =
        (previousSchedule!.orderIndex + nextSchedule!.orderIndex) / 2;
    }

    // 기존 계획블록의 orderIndex 변경
    const updatedSchedule = await Schedule.findOneAndUpdate(
      {
        _id: scheduleId,
      },
      {
        orderIndex: newOrderIndex,
      },
      { new: true }
    );
    return updatedSchedule;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateScheduleCategory = async (
  scheduleId: string,
  scheduleUpdateDto: ScheduleUpdateDto
): Promise<ScheduleInfo | null> => {
  try {
    const updatedSchedule = await Schedule.findOneAndUpdate(
      {
        _id: scheduleId,
      },
      {
        categoryColorCode: scheduleUpdateDto.categoryColorCode,
      },
      { new: true }
    );

    return updatedSchedule;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getCalendar = async (month: string): Promise<number[]> => {
  const regex = (pattern: string) => new RegExp(`.*${pattern}.*`);
  try {
    // date field 키워드 검색을 통해 특정 년-월에 해당하는 계획들 find
    const dateRegex = regex(month);
    const allMonthSchedules = await Schedule.find({
      date: { $regex: dateRegex },
    }).sort({ date: 1 });

    // promise.all을 통해 전체 계획들의 날짜들을 형식에 맞는 number 배열로 변환
    let days = await Promise.all(
      allMonthSchedules.map((schedule: any) => {
        let date = schedule.date.substr(8, 2);
        date *= 1;
        return date;
      })
    );

    // 배열 내 중복 제거
    days = Array.from(new Set(days));
    return days;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateSchedule = async (
  scheduleId: string,
  scheduleUpdateDto: ScheduleUpdateDto,
  newSubSchedules: SubScheduleIdTitleListDto
) => {
  try {
    // 상위 계획블록의 제목, 카테고리 색상 먼저 덮어 쓰고, 기존의 하위 계획 탐색
    const existingSchedule = await Schedule.findByIdAndUpdate(
      scheduleId,
      scheduleUpdateDto
    ).populate({
      path: 'subSchedules',
      model: 'Schedule',
    });

    if (!existingSchedule) {
      // scheduleId에 해당하는 원본 계획블록이 없는 경우, null을 return
      return existingSchedule;
    }

    // 기존 하위 계획 블록들로 새로운 하위 계획 블록의 orderIndex 계산
    let existingSubSchedules = await Promise.all(
      existingSchedule.subSchedules.map((existingSubSchedule: any) => {
        const result = {
          date: '',
          title: existingSubSchedule.title,
          categoryColorCode: existingSubSchedule.categoryColorCode,
          userId: existingSubSchedule.userId,
          orderIndex: existingSubSchedule.orderIndex,
          isRoutine: true,
        };
        return result;
      })
    );
    existingSubSchedules = existingSubSchedules.sort(
      (a, b) => a.orderIndex - b.orderIndex
    );
    let newSubScheduleOrderIndex = calculateOrderIndex(
      existingSubSchedules as ScheduleInfo[]
    );

    // promise.all로 하위 계획 생성 / 업데이트 처리
    let newSubScheduleIds = await Promise.all(
      newSubSchedules.subSchedules.map(async (newSubSchedule: any) => {
        if (!newSubSchedule.scheduleId) {
          // id가 존재하지 않는 경우 : 새로 생성할 하위 계획 : 새로운 계획 생성 및 id 배열에 push
          const scheduleCreateDto: ScheduleCreateDto = {
            date: existingSchedule.date,
            title: newSubSchedule.title,
            categoryColorCode: scheduleUpdateDto.categoryColorCode!,
            userId: existingSchedule.userId,
            orderIndex: newSubScheduleOrderIndex,
          };
          newSubScheduleOrderIndex += 1024;
          const schedule = new Schedule(scheduleCreateDto);
          await schedule.save();
          return schedule._id;
        } else {
          // id가 존재하는 경우 : 이미 존재하는 하위 계획 : 기존 하위 계획 title, categoryColorCode 업데이트
          const subScheduleUpdateDto: ScheduleUpdateDto = {
            title: newSubSchedule.title,
            categoryColorCode: scheduleUpdateDto.categoryColorCode,
          };
          await Schedule.findByIdAndUpdate(
            newSubSchedule.scheduleId,
            subScheduleUpdateDto
          );
        }
      })
    );
    newSubScheduleIds = _.compact(newSubScheduleIds); // id 배열에서 undefined 삭제

    // 상위 계획블록의 subSchedules 배열에 새로 만든 하위 계획의 id 삽입
    await Schedule.findByIdAndUpdate(
      {
        _id: scheduleId,
      },
      {
        $set: { date: scheduleUpdateDto.date, orderIndex: newIndex },
      },
      { new: true }
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateScheduleDate = async (
  scheduleId: string,
  scheduleUpdateDto: ScheduleUpdateDto
): Promise<ScheduleInfo | null> => {
  try {
    // date로 요일 계획블록 조회
    const moveSchedule = await Schedule.find({
      date: scheduleUpdateDto.date,
    }).sort({ orderIndex: 1 });

    // 새로운 orderIndex 생성
    const newIndex = calculateOrderIndex(moveSchedule);

    // date와 orderIndex 수정
    const moveScheduleToOtherDays = await Schedule.findByIdAndUpdate(
        $push: { subSchedules: { $each: newSubScheduleIds } },
      },
      {
        new: true,
      }
    );
   
    return moveScheduleToOtherDays;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getWeeklySchedules = async (
  userId: string,
  startDate: string,
  endDate: string
): Promise<ScheduleListGetDto[]> => {
  try {
    const daysOfWeek = calculateDaysOfWeek(startDate, endDate);
    const schedulesOfWeek = await Promise.all(
      daysOfWeek.map(async (day: string) => {
        const schedulesOfDay = await Schedule.find({
          date: day,
          userId: userId,
        }).sort({ orderIndex: 1 });
        return { schedules: schedulesOfDay };
      })
    );
    return schedulesOfWeek;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  createSchedule,
  deleteSchedule,
  createTime,
  deleteTime,
  completeSchedule,
  dayReschedule,
  getDailySchedules,
  getSubSchedules,
  getReschedules,
  updateScheduleTitle,
  createRoutine,
  getRoutines,
  rescheduleDay,
  routineDay,
  updateScheduleOrder,
  updateScheduleCategory,
  getCalendar,
  updateSchedule,
  updateScheduleDate,
  getWeeklySchedules,
};

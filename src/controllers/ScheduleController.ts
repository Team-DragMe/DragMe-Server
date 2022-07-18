import express, { Request, Response } from 'express';
import util from '../modules/util';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import { ScheduleCreateDto } from '../interfaces/schedule/ScheduleCreateDto';
import ScheduleService from '../services/ScheduleService';
import mongoose from 'mongoose';
import { ScheduleUpdateDto } from '../interfaces/schedule/ScheduleUpdateDto';
import { TimeDto } from '../interfaces/schedule/TimeDto';

/**
 * @route POST /schedule
 * @desc Create Schedule
 * @access Public
 */
const createSchedule = async (req: Request, res: Response) => {
  let scheduleCreateDto: ScheduleCreateDto = req.body;
  const userId = '62cd27ae39f42cfbf520009a'; // 임시 구현
  // const userId = req.user;
  scheduleCreateDto.userId = new mongoose.Types.ObjectId(userId);
  if (!scheduleCreateDto.title || !scheduleCreateDto.date) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }

  try {
    await ScheduleService.createSchedule(scheduleCreateDto);

    res
      .status(statusCode.CREATED)
      .send(util.success(statusCode.CREATED, message.CREATE_SCHEDULE_SUCCESS));
  } catch (error) {
    console.log(error);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }
};

/**
 * @route Delete /schedule
 * @desc Delete Schedule Time
 * @access Public
 */
const deleteSchedule = async (req: Request, res: Response) => {
  let { scheduleId } = req.body;
  scheduleId = new mongoose.Types.ObjectId(scheduleId);
  try {
    await ScheduleService.deleteSchedule(scheduleId);
    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.DELETE_SCHEDULE_TIME_SUCCESS));
  } catch (error) {
    console.log(error);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }
};

/**
 * @route POST /schedule/time
 * @desc Create Schedule Time
 * @access Public
 */
const createTime = async (req: Request, res: Response) => {
  let { scheduleId } = req.body;
  const timeDto: TimeDto = req.body;
  scheduleId = new mongoose.Types.ObjectId(scheduleId);
  try {
    const createScheduleTime = await ScheduleService.createTime(
      scheduleId,
      timeDto
    );
    if (!createScheduleTime) {
      // scheduleId가 잘못된 경우, 404 return
      return res
        .status(statusCode.NOT_FOUND)
        .send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));
    }
    res
      .status(statusCode.CREATED)
      .send(
        util.success(statusCode.CREATED, message.CREATE_SCHEDULE_TIME_SUCCESS)
      );
  } catch (error) {
    console.log(error);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }
};

/**
 * @route Delete /schedule/time
 * @desc Delete Schedule Time
 * @access Public
 */
const deleteTime = async (req: Request, res: Response) => {
  let { scheduleId } = req.body;
  const timeDto: TimeDto = req.body;
  scheduleId = new mongoose.Types.ObjectId(scheduleId);
  try {
    const deleteScheduleTime = await ScheduleService.deleteTime(
      scheduleId,
      timeDto
    );
    if (!deleteScheduleTime) {
      // scheduleId가 잘못된 경우, 404 return
      return res
        .status(statusCode.NOT_FOUND)
        .send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));
    }
    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.DELETE_SCHEDULE_TIME_SUCCESS));
  } catch (error) {
    console.log(error);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }
};

/**
 * @route PATCH /schedule/day-reschedule
 * @desc Delay Schedule
 * @access Public
 */
const dayReschedule = async (req: Request, res: Response) => {
  let { scheduleId } = req.body;
  scheduleId = new mongoose.Types.ObjectId(scheduleId);
  try {
    const delaySchedule = await ScheduleService.dayReschedule(scheduleId);

    if (!delaySchedule) {
      // scheduleId가 잘못된 경우, 404 return
      return res
        .status(statusCode.NOT_FOUND)
        .send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));
    }
    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.DELAY_SCHEDULE_SUCCESS));
  } catch (error) {
    console.log(error);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }
};

/**
 * @route GET /schedule/days?date=
 * @desc Get Daily Schedules
 * @access Public
 */
const getDailySchedules = async (req: Request, res: Response) => {
  const { date } = req.query;
  const userId = new mongoose.Types.ObjectId('62cd27ae39f42cfbf520009a'); // 임시 구현
  if (!date) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }

  try {
    const dailySchedules = await ScheduleService.getDailySchedules(
      date as string,
      userId
    );
    res
      .status(statusCode.OK)
      .send(
        util.success(
          statusCode.OK,
          message.GET_DAILY_SCHEDULES_SUCCESS,
          dailySchedules
        )
      );
  } catch (error) {
    console.log(error);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }
};

/**
 * @route GET /schedule/subschedule
 * @desc GET SubSchedule
 * @access Public
 */
const getSubSchedules = async (req: Request, res: Response) => {
  const { scheduleId } = req.body;
  if (!scheduleId || scheduleId.length != 24) {
    // 유효하지 않은 scheduleId인 경우 : 400 error
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }

  try {
    const subSchedules = await ScheduleService.getSubSchedules(scheduleId);
    res
      .status(statusCode.OK)
      .send(
        util.success(
          statusCode.OK,
          message.GET_SUBSCHEDULES_SUCCESS,
          subSchedules
        )
      );
  } catch (error) {
    console.log(error);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }
};

/**
 * @route PATCH /schedule/complete
 * @desc Complete Schedule
 * @access Public
 */
const completeSchedule = async (req: Request, res: Response) => {
  let { scheduleId } = req.body;
  if (!scheduleId || scheduleId.length != 24) {
    // 유효하지 않은 scheduleId인 경우 : 400 error
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }

  scheduleId = new mongoose.Types.ObjectId(scheduleId);

  try {
    const checkCompleteSchedule = await ScheduleService.completeSchedule(
      scheduleId
    );
    if (!checkCompleteSchedule) {
      // scheduleId가 잘못된 경우, 404 return
      return res
        .status(statusCode.NOT_FOUND)
        .send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));
    }
    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.COMPLETE_SCHEDULE_SUCCESS));
  } catch (error) {
    console.log(error);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }
};

/**
 * @route GET /schedule/delay
 * @desc Get Reschedules
 * @access Public
 */
const getReschedules = async (req: Request, res: Response) => {
  const userId = new mongoose.Types.ObjectId('62cd27ae39f42cfbf520009a');
  try {
    const data = await ScheduleService.getReschedules(userId);
    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.GET_RESCHEDULES_SUCCESS, data));
  } catch (error) {
    console.log(error);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }
};

/**
 * @route PATCH /schedule/title
 * @desc Update Schedule Title
 * @access Public
 */
const updateScheduleTitle = async (req: Request, res: Response) => {
  const { scheduleId, newTitle } = req.body;

  if (!scheduleId || !newTitle) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }

  const scheduleUpdateDto: ScheduleUpdateDto = {
    title: newTitle,
  };

  try {
    const updatedSchedule = await ScheduleService.updateScheduleTitle(
      scheduleId,
      scheduleUpdateDto
    );

    if (!updatedSchedule) {
      // scheduleId가 잘못된 경우, 404 return
      return res
        .status(statusCode.NOT_FOUND)
        .send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));
    }

    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.UPDATE_SCHEDULE_TITLE_SUCCESS));
  } catch (error) {
    console.log(error);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }
};

/**
 * @route POST /schedule/day-routine
 * @desc Create Routine with Schedule
 * @access Public
 */
const createRoutine = async (req: Request, res: Response) => {
  let { scheduleId } = req.body;
  if (!scheduleId || scheduleId.length != 24) {
    // 유효하지 않은 scheduleId인 경우 : 400 error
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }

  scheduleId = new mongoose.Types.ObjectId(scheduleId);
  const userId = new mongoose.Types.ObjectId('62cd27ae39f42cfbf520009a');

  try {
    const newRoutine = await ScheduleService.createRoutine(userId, scheduleId);

    if (!newRoutine) {
      // newRoutine으로 null이 반환 된 경우(scheduleId에 해당하는 원본 계획블록이 없는 경우) :  404 error
      return res
        .status(statusCode.NOT_FOUND)
        .send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));
    }

    res
      .status(statusCode.CREATED)
      .send(util.success(statusCode.CREATED, message.CREATE_ROUTINE_SUCCESS));
  } catch (error) {
    console.log(error);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }
};

/**
 * @route GET /schedule/routine
 * @desc Get Routines
 * @access Public
 */
const getRoutines = async (req: Request, res: Response) => {
  const userId = new mongoose.Types.ObjectId('62cd27ae39f42cfbf520009a');
  try {
    const routines = await ScheduleService.getRoutines(userId);
    res
      .status(statusCode.OK)
      .send(
        util.success(statusCode.OK, message.GET_ROUTINES_SUCCESS, routines)
      );
  } catch (error) {
    console.log(error);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }
};

/**
 * @route PATCH /schedule/reschedule-day
 * @desc Move Reschedule back to Schedules
 * @access Public
 */
const rescheduleDay = async (req: Request, res: Response) => {
  let { scheduleId } = req.body;
  const { date } = req.body;
  scheduleId = new mongoose.Types.ObjectId(scheduleId);
  try {
    const moveBackSchedule = await ScheduleService.rescheduleDay(
      scheduleId,
      date
    );
    if (!moveBackSchedule) {
      // scheduleId가 잘못된 경우, 404 return
      return res
        .status(statusCode.NOT_FOUND)
        .send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));
    }
    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.MOVE_BACK_SCHEDULE_SUCCESS));
  } catch (error) {
    console.log(error);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }
};

/**
 * @route POST /schedule/reschedule-day
 * @desc Move Routine to Schedules
 * @access Public
 */
const routineDay = async (req: Request, res: Response) => {
  let { scheduleId } = req.body;
  const { date } = req.body;
  if (!scheduleId || scheduleId.length != 24) {
    // 유효하지 않은 scheduleId인 경우 : 400 error
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }

  scheduleId = new mongoose.Types.ObjectId(scheduleId);
  const userId = new mongoose.Types.ObjectId('62cd27ae39f42cfbf520009a');
  try {
    const moveRoutineToSchedule = await ScheduleService.routineDay(
      userId,
      scheduleId,
      date
    );
    if (!moveRoutineToSchedule) {
      // scheduleId가 잘못된 경우, 404 return
      return res
        .status(statusCode.NOT_FOUND)
        .send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));
    }
    res
      .status(statusCode.OK)
      .send(
        util.success(statusCode.OK, message.MOVE_ROUTINE_TO_SCHEDULE_SUCCESS)
      );
  } catch (error) {
    console.log(error);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }
};

/**
 * @route PATCH /schedule/order
 * @desc Reorder Schedules
 * @access Public
 */
const updateScheduleOrder = async (req: Request, res: Response) => {
  let { scheduleId } = req.body;
  const { movedScheduleArray } = req.body;

  if (!scheduleId || scheduleId.length != 24) {
    // 유효하지 않은 scheduleId인 경우 : 400 error
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }

  try {
    const updatedSchedule = await ScheduleService.updateScheduleOrder(
      scheduleId,
      movedScheduleArray
    );
    if (!updatedSchedule) {
      // scheduleId가 잘못된 경우, 404 return
      return res
        .status(statusCode.NOT_FOUND)
        .send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));
    }
    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.UPDATE_SCHEDULE_ORDER_SUCCESS));
  } catch (error) {
    console.log(error);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }
};

/**
 * @route PATCH /schedule/category
 * @desc Update Schedule Category Color Code
 * @access Public
 */
const updateScheduleCategory = async (req: Request, res: Response) => {
  const { scheduleId, newCategoryColorCode } = req.body;

  if (!scheduleId || !newCategoryColorCode) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }

  const scheduleUpdateDto: ScheduleUpdateDto = {
    categoryColorCode: newCategoryColorCode,
  };

  try {
    const updatedSchedule = await ScheduleService.updateScheduleCategory(
      scheduleId,
      scheduleUpdateDto
    );
    if (!updatedSchedule) {
      // scheduleId가 잘못된 경우, 404 return
      return res
        .status(statusCode.NOT_FOUND)
        .send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));
    }
    res
      .status(statusCode.OK)
      .send(
        util.success(statusCode.OK, message.UPDATE_SCHEDULE_CATEGORY_SUCCESS)
      );
  } catch (error) {
    console.log(error);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }
};

/**
 * @route GET /schedule/calendar
 * @desc Get Calendar with Schedules
 * @access Public
 */
const getCalendar = async (req: Request, res: Response) => {
  const { month } = req.query;
  try {
    const calendarDays = await ScheduleService.getCalendar(month as string);

    res
      .status(statusCode.OK)
      .send(
        util.success(
          statusCode.OK,
          message.GET_CALENDAR_WITH_SCHEDULES_SUCCESS,
          calendarDays
        )
      );
  } catch (error) {
    console.log(error);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }
};

export default {
  createSchedule,
  createTime,
  deleteTime,
  deleteSchedule,
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
};

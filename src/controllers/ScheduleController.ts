import express, { Request, Response } from 'express';
import util from '../modules/util';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import { ScheduleCreateDto } from '../interfaces/schedule/ScheduleCreateDto';
import ScheduleService from '../services/ScheduleService';
import mongoose from 'mongoose';
import { ScheduleUpdateDto } from '../interfaces/schedule/ScheduleUpdateDto';
import { TimeDto } from '../interfaces/schedule/TimeDto';
import { SubScheduleIdTitleListDto } from '../interfaces/schedule/SubScheduleIdTitleListDto';
import { slackMessage } from '../modules/returnToSlackMessage';
import { sendMessagesToSlack } from '../modules/slackAPI';
import { objectIdListDto } from '../interfaces/common/objectIdListDto';

/**
 * @route POST /schedule
 * @desc Create Schedule
 * @access Public
 */
const createSchedule = async (req: Request, res: Response) => {
  let scheduleCreateDto: ScheduleCreateDto = req.body;
  scheduleCreateDto.userId = '62cd27ae39f42cfbf520009a';
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
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      error,
      req.body.user?.id
    );
    sendMessagesToSlack(errorMessage);
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
 * @route Delete /schedule?scheduleId=
 * @desc Delete Schedule Time
 * @access Public
 */
const deleteSchedule = async (req: Request, res: Response) => {
  let { scheduleId } = req.query;
  try {
    const deleteSchedules = await ScheduleService.deleteSchedule(
      scheduleId as string
    );
    if (!deleteSchedules) {
      // scheduleId가 잘못된 경우, 404 return
      return res
        .status(statusCode.NOT_FOUND)
        .send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));
    }
    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.DELETE_SCHEDULE_SUCCESS));
  } catch (error) {
    console.log(error);
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      error,
      req.body.user?.id
    );
    sendMessagesToSlack(errorMessage);
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
 * @route POST /schedule/time?scheduleId=
 * @desc Create Schedule Time
 * @access Public
 */
const createTime = async (req: Request, res: Response) => {
  let { scheduleId } = req.query;
  const timeDto: TimeDto = req.body;
  try {
    const createScheduleTime = await ScheduleService.createTime(
      scheduleId as string,
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
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      error,
      req.body.user?.id
    );
    sendMessagesToSlack(errorMessage);
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
 * @route Delete /schedule/time?scheduleId=
 * @desc Delete Schedule Time
 * @access Public
 */
const deleteTime = async (req: Request, res: Response) => {
  let { scheduleId } = req.query;
  const timeDto: TimeDto = req.body;
  try {
    const deleteScheduleTime = await ScheduleService.deleteTime(
      scheduleId as string,
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
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      error,
      req.body.user?.id
    );
    sendMessagesToSlack(errorMessage);
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
  let { scheduleId } = req.query;
  try {
    const delaySchedule = await ScheduleService.dayReschedule(
      scheduleId as string
    );

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
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      error,
      req.body.user?.id
    );
    sendMessagesToSlack(errorMessage);
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
  const userId: string = '62cd27ae39f42cfbf520009a';
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
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      error,
      req.body.user?.id
    );
    sendMessagesToSlack(errorMessage);
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
 * @route GET /schedule/subschedule?scheduleId=
 * @desc GET SubSchedule
 * @access Public
 */
const getSubSchedules = async (req: Request, res: Response) => {
  const { scheduleId } = req.query;
  try {
    const subSchedules = await ScheduleService.getSubSchedules(
      scheduleId as string
    );

    if (!subSchedules) {
      // scheduleId가 잘못된 경우, 404 return
      return res
        .status(statusCode.NOT_FOUND)
        .send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));
    }
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
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      error,
      req.body.user?.id
    );
    sendMessagesToSlack(errorMessage);
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
 * @route PATCH /schedule/complete?scheduleId=
 * @desc Complete Schedule
 * @access Public
 */
const completeSchedule = async (req: Request, res: Response) => {
  let { scheduleId } = req.query;

  try {
    const checkCompleteSchedule = await ScheduleService.completeSchedule(
      scheduleId as string
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
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      error,
      req.body.user?.id
    );
    sendMessagesToSlack(errorMessage);
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
  const userId = '62cd27ae39f42cfbf520009a';
  try {
    const data = await ScheduleService.getReschedules(userId);
    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.GET_RESCHEDULES_SUCCESS, data));
  } catch (error) {
    console.log(error);
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      error,
      req.body.user?.id
    );
    sendMessagesToSlack(errorMessage);
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
 * @route PATCH /schedule/title?scheduleId=
 * @desc Update Schedule Title
 * @access Public
 */
const updateScheduleTitle = async (req: Request, res: Response) => {
  const { scheduleId } = req.query;
  const scheduleUpdateDto: ScheduleUpdateDto = req.body;

  try {
    const updatedSchedule = await ScheduleService.updateScheduleTitle(
      scheduleId as string,
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
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      error,
      req.body.user?.id
    );
    sendMessagesToSlack(errorMessage);
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
 * @route POST /schedule/day-routine?scheduleId=
 * @desc Create Routine with Schedule
 * @access Public
 */
const createRoutine = async (req: Request, res: Response) => {
  const { scheduleId } = req.query;
  const userId = '62cd27ae39f42cfbf520009a';

  try {
    const newRoutine = await ScheduleService.createRoutine(
      userId,
      scheduleId as string
    );

    if (!newRoutine) {
      // newRoutine으로 null이 반환 된 경우 (scheduleId에 해당하는 원본 계획블록이 없는 경우) :  404 error
      return res
        .status(statusCode.NOT_FOUND)
        .send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));
    }

    res
      .status(statusCode.CREATED)
      .send(util.success(statusCode.CREATED, message.CREATE_ROUTINE_SUCCESS));
  } catch (error) {
    console.log(error);
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      error,
      req.body.user?.id
    );
    sendMessagesToSlack(errorMessage);
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
  const userId = '62cd27ae39f42cfbf520009a';
  try {
    const routines = await ScheduleService.getRoutines(userId);
    res
      .status(statusCode.OK)
      .send(
        util.success(statusCode.OK, message.GET_ROUTINES_SUCCESS, routines)
      );
  } catch (error) {
    console.log(error);
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      error,
      req.body.user?.id
    );
    sendMessagesToSlack(errorMessage);
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
 * @route PATCH /schedule/reschedule-day?scheduleId=
 * @desc Move Reschedule back to Schedules
 * @access Public
 */
const rescheduleDay = async (req: Request, res: Response) => {
  const { scheduleId } = req.query;
  const scheduleUpdateDto: ScheduleUpdateDto = req.body;
  console.log(scheduleUpdateDto);

  try {
    const moveBackSchedule = await ScheduleService.rescheduleDay(
      scheduleId as string,
      scheduleUpdateDto
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
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      error,
      req.body.user?.id
    );
    sendMessagesToSlack(errorMessage);
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
 * @route POST /schedule/routine-day?scheduleId=
 * @desc Move Routine to Schedules
 * @access Public
 */
const routineDay = async (req: Request, res: Response) => {
  let { scheduleId } = req.query;
  const scheduleUpdateDto: ScheduleUpdateDto = req.body;
  const userId = '62cd27ae39f42cfbf520009a';
  try {
    const moveRoutineToSchedule = await ScheduleService.routineDay(
      userId,
      scheduleId as string,
      scheduleUpdateDto
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
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      error,
      req.body.user?.id
    );
    sendMessagesToSlack(errorMessage);
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
 * @route PATCH /schedule/order?scheduleId=
 * @desc Reorder Schedules
 * @access Public
 */
const updateScheduleOrder = async (req: Request, res: Response) => {
  const { scheduleId } = req.query;
  const objectIdListDto: objectIdListDto = req.body;

  try {
    const updatedSchedule = await ScheduleService.updateScheduleOrder(
      scheduleId as string,
      objectIdListDto
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
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      error,
      req.body.user?.id
    );
    sendMessagesToSlack(errorMessage);
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
 * @route PATCH /schedule/category?scheduleId=
 * @desc Update Schedule Category Color Code
 * @access Public
 */
const updateScheduleCategory = async (req: Request, res: Response) => {
  const { scheduleId } = req.query;
  const scheduleUpdateDto: ScheduleUpdateDto = req.body;

  try {
    const updatedSchedule = await ScheduleService.updateScheduleCategory(
      scheduleId as string,
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
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      error,
      req.body.user?.id
    );
    sendMessagesToSlack(errorMessage);
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
  const userId: string = '62cd27ae39f42cfbf520009a';
  const { month } = req.query;

  if (!month) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }
  try {
    const calendarDays = await ScheduleService.getCalendar(
      userId,
      month as string
    );

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
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      error,
      req.body.user?.id
    );
    sendMessagesToSlack(errorMessage);
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
 * @route PATCH /schedule?scheduleId=
 * @desc Update Schedule
 * @access Public
 */
const updateSchedule = async (req: Request, res: Response) => {
  const { scheduleId } = req.query;
  const { title, categoryColorCode, subSchedules } = req.body;
  const scheduleUpdateDto: ScheduleUpdateDto = {
    title: title,
    categoryColorCode: categoryColorCode,
  };
  const subScheduleIdTitleListDto: SubScheduleIdTitleListDto = {
    subSchedules: subSchedules,
  };
  try {
    const updatedSchedule = await ScheduleService.updateSchedule(
      scheduleId as string,
      scheduleUpdateDto,
      subScheduleIdTitleListDto
    );
    if (!updatedSchedule) {
      // scheduleId가 잘못된 경우, 404 return
      return res
        .status(statusCode.NOT_FOUND)
        .send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));
    }
    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.UPDATE_SCHEDULE_SUCCESS));
  } catch (error) {
    console.log(error);
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      error,
      req.body.user?.id
    );
    sendMessagesToSlack(errorMessage);
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
 * @route PATCH /schedule/days
 * @desc Move Schedule to Other Days
 * @access Public
 */
const updateScheduleDate = async (req: Request, res: Response) => {
  const { scheduleId } = req.query;
  const scheduleUpdateDto = req.body;
  if (!scheduleUpdateDto) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }
  try {
    const moveScheduleToOtherDays = await ScheduleService.updateScheduleDate(
      scheduleId as string,
      scheduleUpdateDto
    );
    if (!moveScheduleToOtherDays) {
      // scheduleId가 잘못된 경우, 404 return
      return res
        .status(statusCode.NOT_FOUND)
        .send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));
    }
    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.UPDATE_SCHEDULE_DATE_SUCCESS));
  } catch (error) {
    console.log(error);
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      error,
      req.body.user?.id
    );
    sendMessagesToSlack(errorMessage);
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
 * @route GET /schedule/weeks?startDate=&endDate=
 * @desc Get Weekly Schedules
 * @access Public
 */
const getWeeklySchedules = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  const userId: string = '62cd27ae39f42cfbf520009a';
  try {
    const schedulesOfWeek = await ScheduleService.getWeeklySchedules(
      userId,
      startDate as string,
      endDate as string
    );

    res
      .status(statusCode.OK)
      .send(
        util.success(
          statusCode.OK,
          message.GET_WEEKLY_SCHEDULES_SUCCESS,
          schedulesOfWeek
        )
      );
  } catch (error) {
    console.log(error);
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      error,
      req.body.user?.id
    );
    sendMessagesToSlack(errorMessage);
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
  updateSchedule,
  updateScheduleDate,
  getWeeklySchedules,
};

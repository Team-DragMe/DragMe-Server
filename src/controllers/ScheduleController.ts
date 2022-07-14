import express, { Request, Response } from 'express';
import util from '../modules/util';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import { ScheduleCreateDto } from '../interfaces/schedule/ScheduleCreateDto';
import ScheduleService from '../services/ScheduleService';
import mongoose from 'mongoose';
import { ScheduleUpdateDto } from '../interfaces/schedule/ScheduleUpdateDto';
import Schedule from '../models/Schedule';

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
 * @route PATCH /schedule/day-reschedule
 * @desc Delay Schedule
 * @access Public
 */
const dayReschedule = async (req: Request, res: Response) => {
  const scheduleId = new mongoose.Types.ObjectId('62cd876a77bc33d906978333');
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
  // let { scheduleId } = req.body; // 이후에 scheduleId까지 받기
  const { newTitle } = req.body;
  const scheduleId = new mongoose.Types.ObjectId('62cd876a77bc33d906978333');

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

export default {
  createSchedule,
  dayReschedule,
  getDailySchedules,
  getReschedules,
  updateScheduleTitle,
};

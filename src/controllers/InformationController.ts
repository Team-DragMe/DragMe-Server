import express, { Request, Response } from 'express';
import statusCode from '../modules/statusCode';
import message from '../modules/responseMessage';
import util from '../modules/util';
import { InformationCreateDto } from '../interfaces/information/InformationCreateDto';
import InformationService from '../services/InformationService';
import mongoose from 'mongoose';
import { slackMessage } from '../modules/returnToSlackMessage';
import { sendMessagesToSlack } from '../modules/slackAPI';

/**
 * @route POST /information/
 * @desc Create Information
 * @access Public
 */
const createInformation = async (req: Request, res: Response) => {
  let informationCreateDto: InformationCreateDto = req.body;
  informationCreateDto.userId = '62cd6eb82b6b4e92c7fc08f1';
  try {
    await InformationService.createInformation(informationCreateDto);

    res
      .status(statusCode.CREATED)
      .send(
        util.success(statusCode.CREATED, message.CREATE_INFORMATION_SUCCESS)
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
 * @route GET /information/days?date
 * @desc GET Schedule Information
 * @access Public
 */
const getDailyInformation = async (req: Request, res: Response) => {
  const { date } = req.query;
  if (!date) {
    res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }
  try {
    const data = await InformationService.getDailyInformation(date as string);
    res
      .status(statusCode.OK)
      .send(
        util.success(statusCode.OK, message.GET_DAILY_INFORMATION_SUCCESS, data)
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
    res
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
 * @route GET /information/months?date
 * @desc GET MonthlyGoal Information
 * @access Public
 */
const getMonthlyGoal = async (req: Request, res: Response) => {
  const { date } = req.query;
  const userId = new mongoose.Types.ObjectId('62cd6eb82b6b4e92c7fc08f1');
  if (!date) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }
  try {
    const data = await InformationService.getMonthlyGoal(
      date as string,
      userId
    );
    res
      .status(statusCode.OK)
      .send(
        util.success(statusCode.OK, message.GET_MONTHLY_GOAL_SUCCESS, data)
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
    res
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
 * @route GET /information/emoji?startDate=&endDate=
 * @desc GET Weekly Emojis
 * @access Public
 */
const getWeeklyEmojis = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  const userId: string = '62cd6eb82b6b4e92c7fc08f1';
  try {
    const weeklyEmojis = await InformationService.getWeeklyEmojis(
      userId,
      startDate as string,
      endDate as string
    );
    res
      .status(statusCode.OK)
      .send(
        util.success(
          statusCode.OK,
          message.GET_WEEKLY_EMOJIS_SUCCESS,
          weeklyEmojis
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

/* @route GET /information/weeks?date
 * @desc GET weeklyGoal Information
 * @access Public
 */
const getWeeklyGoal = async (req: Request, res: Response) => {
  const { date } = req.query;
  if (!date) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }
  try {
    const data = await InformationService.getWeeklyGoal(date as string);
    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.GET_WEEKLY_GOAL_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res
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
  createInformation,
  getDailyInformation,
  getMonthlyGoal,
  getWeeklyEmojis,
  getWeeklyGoal,
};

import express, { Request, response, Response } from 'express';
import statusCode from '../modules/statusCode';
import message from '../modules/responseMessage';
import util from '../modules/util';
import { InformationCreateDto } from '../interfaces/information/InformationCreateDto';
import InformationService from '../services/InformationService';

/**
 * @route POST /information/memo
 * @desc Create Daily Memo
 * @access Public
 */
const createDailyMemo = async (req: Request, res: Response) => {
  const informationCreateDto: InformationCreateDto = req.body;
  try {
    await InformationService.createDailyMemo(informationCreateDto);

    res
      .status(statusCode.CREATED)
      .send(util.success(statusCode.CREATED, message.CREATE_MEMO_SUCCESS));
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
 * @route POST /information/emoji
 * @desc Create Emoji
 * @access Public
 */
const createEmoji = async (req: Request, res: Response) => {
  const informationCreateDto: InformationCreateDto = req.body;
  try {
    await InformationService.createEmoji(informationCreateDto);

    res
      .status(statusCode.CREATED)
      .send(util.success(statusCode.CREATED, message.CREATE_EMOJI_SUCCESS));
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

/**
 * @route POST /information/days
 * @desc Create Daily Goal
 * @access Public
 */
const createDailyGoal = async (req: Request, res: Response) => {
  let informationCreateDto: InformationCreateDto = req.body;
  informationCreateDto.userId = '62cd6eb82b6b4e92c7fc08f1';
  informationCreateDto.type = 'dailyGoal';

  try {
    await InformationService.createDailyGoal(informationCreateDto);

    res
      .status(statusCode.CREATED)
      .send(
        util.success(statusCode.CREATED, message.CREATE_DAILY_GOAL_SUCCESS)
      );
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
  createDailyMemo,
  getDailyInformation,
  createEmoji,
  createDailyGoal,
};

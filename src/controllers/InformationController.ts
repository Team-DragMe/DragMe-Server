import express, { Request, response, Response } from 'express';
import statusCode from '../modules/statusCode';
import message from '../modules/responseMessage';
import util from '../modules/util';
import { DailyMemoCreateDto } from '../interfaces/information/DailyMemoCreateDto';
import InformationService from '../services/InformationService';

/**
 * @route POST /information/days
 * @desc Create dailyMemo
 * @access Public
 */
const createDailyMemo = async (req: Request, res: Response) => {
  const dailyMemoCreateDto: DailyMemoCreateDto = req.body;
  try {
    await InformationService.createDailyMemo(dailyMemoCreateDto);

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
const getDailyInformation = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { date } = req.query;
  try {
    if (!date) {
      res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    } else {
      const data = await InformationService.getDailyInformation(date as string);
      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            message.GET_DAILYSCHEDULE_INFORMATION_SUCESS,
            data
          )
        );
    }
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
export default { createDailyMemo, getDailyInformation };

import express, { Request, response, Response } from 'express';
import statusCode from '../modules/statusCode';
import responseMessage from '../modules/responseMessage';
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
      .send(
        util.success(statusCode.CREATED, responseMessage.CREATE_MEMO_SUCCESS)
      );
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          responseMessage.INTERNAL_SERVER_ERROR
        )
      );
  }
};

export default { createDailyMemo };

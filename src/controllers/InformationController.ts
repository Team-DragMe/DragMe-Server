import express, { Request, response, Response } from 'express';
import statusCode from '../modules/statusCode';
import responseMessage from '../modules/responseMessage';
import util from '../modules/util';
import { DailyNoteCreateDto } from '../interfaces/information/DailyNoteCreateDto';
import InformationService from '../services/InformationService';

/**
 * @route POST /information/days
 * @desc Create dailyNote
 * @access Public
 */
const createDailyNote = async (req: Request, res: Response): Promise<void> => {
  const dailyNoteCreateDto: DailyNoteCreateDto = req.body;
  try {
    await InformationService.createDailyNote(dailyNoteCreateDto);

    res
      .status(statusCode.CREATED)
      .send(
        util.success(statusCode.CREATED, responseMessage.CREATED_MEMO_SUCCESS)
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

export default { createDailyNote };

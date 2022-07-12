//router index file
import { Router } from 'express';
import ScheduleRouter from './ScheduleRouter';

const router = Router();

router.use('/schedule', ScheduleRouter);

export default router;

import { Router } from 'express';
import InformationRouter from './InformationRouter';
import ScheduleRouter from './ScheduleRouter';

const router = Router();

router.use('/information', InformationRouter);
router.use('/schedule', ScheduleRouter);

export default router;

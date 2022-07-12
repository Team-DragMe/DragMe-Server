import { Router } from 'express';
import ScheduleController from '../controllers/ScheduleController';

const router: Router = Router();

router.post('/', ScheduleController.createSchedule);

export default router;

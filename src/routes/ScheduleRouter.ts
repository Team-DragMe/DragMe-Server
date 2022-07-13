import { Router } from 'express';
import ScheduleController from '../controllers/ScheduleController';

const router: Router = Router();

router.post('/', ScheduleController.createSchedule);
router.patch('/day-reschedule', ScheduleController.dayReschedule);
router.get('/days', ScheduleController.getDailySchedules);

export default router;
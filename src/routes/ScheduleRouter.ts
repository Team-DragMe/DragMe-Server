import { Router } from 'express';
import ScheduleController from '../controllers/ScheduleController';

const router: Router = Router();

router.post('/', ScheduleController.createSchedule);
router.patch('/day-reschedule', ScheduleController.reschedule);
export default router;

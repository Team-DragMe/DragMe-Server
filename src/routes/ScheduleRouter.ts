import { Router } from 'express';
import ScheduleController from '../controllers/ScheduleController';

const router: Router = Router();

router.post('/', ScheduleController.createSchedule);
router.patch('/day-reschedule', ScheduleController.dayReschedule);
router.get('/days', ScheduleController.getDailySchedules);
router.get('/delay', ScheduleController.getReschedules);
router.patch('/title', ScheduleController.updateScheduleTitle);
router.post('/day-routine', ScheduleController.createRoutine);
router.get('/routine', ScheduleController.getRoutines);
router.patch('/reschedule-day', ScheduleController.rescheduleDay);

export default router;

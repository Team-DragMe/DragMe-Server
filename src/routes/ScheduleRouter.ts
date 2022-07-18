import { Router } from 'express';
import ScheduleController from '../controllers/ScheduleController';

const router: Router = Router();

router.post('/', ScheduleController.createSchedule);
router.delete('/', ScheduleController.deleteSchedule);
router.post('/time', ScheduleController.createTime);
router.delete('/time', ScheduleController.deleteTime);
router.patch('/complete', ScheduleController.completeSchedule);
router.patch('/day-reschedule', ScheduleController.dayReschedule);
router.get('/days', ScheduleController.getDailySchedules);
router.get('/subschedule', ScheduleController.getSubSchedules);
router.get('/delay', ScheduleController.getReschedules);
router.patch('/title', ScheduleController.updateScheduleTitle);
router.post('/day-routine', ScheduleController.createRoutine);
router.get('/routine', ScheduleController.getRoutines);
router.patch('/reschedule-day', ScheduleController.rescheduleDay);
router.post('/routine-day', ScheduleController.routineDay);
router.patch('/order', ScheduleController.updateScheduleOrder);
router.patch('/category', ScheduleController.updateScheduleCategory);
router.get('/calendar', ScheduleController.getCalendar);
router.patch('/days', ScheduleController.moveDays);

export default router;

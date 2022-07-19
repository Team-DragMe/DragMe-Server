import { Router } from 'express';
import { InformationController } from '../controllers';

const router: Router = Router();

router.post('/', InformationController.createInformation);
router.get('/days', InformationController.getDailyInformation);
router.get('/months', InformationController.getMonthlyGoal);
router.get('/emoji', InformationController.getWeeklyEmojis);
router.get('/weeks', InformationController.getWeeklyGoal);
export default router;

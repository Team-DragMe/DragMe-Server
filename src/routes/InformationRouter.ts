import { Router } from 'express';
import { InformationController } from '../controllers';

const router: Router = Router();

router.post('/', InformationController.createInformation);
router.get('/days', InformationController.getDailyInformation);
router.get('/months', InformationController.getMonthlyGoal);
export default router;

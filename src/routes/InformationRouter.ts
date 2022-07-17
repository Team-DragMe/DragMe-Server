import { Router } from 'express';
import { InformationController } from '../controllers';

const router: Router = Router();

router.post('/memo', InformationController.createDailyMemo);
router.get('/days', InformationController.getDailyInformation);
router.post('/emoji', InformationController.createEmoji);
router.post('/days', InformationController.createDailyGoal);

export default router;

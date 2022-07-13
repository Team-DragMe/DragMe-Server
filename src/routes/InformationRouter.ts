import { Router } from 'express';
import { InformationController } from '../controllers';

const router: Router = Router();

router.post('/days', InformationController.createDailyMemo);
router.get('/days', InformationController.getDailyInformation);
router.post('/emoji', InformationController.createEmoji);

export default router;

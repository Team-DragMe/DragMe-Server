import { Router } from 'express';
import { InformationController } from '../controllers';

const router: Router = Router();

router.post('/days', InformationController.createDailyMemo);
router.get('/days', InformationController.getDailyInformation);

export default router;

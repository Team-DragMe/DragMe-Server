import { Router } from 'express';
import { InformationController } from '../controllers';

const router: Router = Router();

router.post('/days', InformationController.createDailyMemo);

export default router;

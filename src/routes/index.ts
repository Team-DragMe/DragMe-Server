//router index file
import { Router } from 'express';
import InformationRouter from './InformationRouter';

const router = Router();

router.use('/information', InformationRouter);

export default router;

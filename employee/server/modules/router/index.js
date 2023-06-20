import express from 'express';

import AuthRouter from '../auth/router';
import AdminRouter from '../admin/router';

const router = express.Router();

router.use('/auth', AuthRouter);
router.use('/admin', AdminRouter);

export default router;

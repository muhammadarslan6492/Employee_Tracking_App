import express from 'express';
import AuthController from '../auth/router';

const router = express.Router();

router.use('/auth', AuthController);

export default router;

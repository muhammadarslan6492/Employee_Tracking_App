import express from 'express';

import validate from '../middleware/validator';

import AuthController from './controller';

const router = express.Router();

router.get('/test', AuthController.test);

router.post('/web-signup', validate.SignupValidator, AuthController.webSignup);

export default router;

import express from 'express';

import validate from '../middleware/validator';
import auth from '../middleware/auth';

import AuthController from './controller';

const router = express.Router();

router.get('/test', AuthController.test);
router.post('/web-signup', validate.SignupValidator, AuthController.webSignup);
router.get('/verify/:JWT', AuthController.verify);
router.post(
  '/resend-verifcation',
  validate.ResendValidator,
  AuthController.resend,
);
router.post('/login', validate.LoginValidator, AuthController.login);
router.get('/profile', auth, AuthController.profile);

export default router;

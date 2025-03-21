import express from 'express';
import {
  login,
  register,
  refreshSession,
  logout,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../validation/user.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), register);

router.post('/login', validateBody(loginSchema), login);

router.post('/refresh', refreshSession);

router.post('/logout', logout);

export default router;

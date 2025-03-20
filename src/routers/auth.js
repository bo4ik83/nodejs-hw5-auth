import express from 'express';

import { registerController } from '../controllers/auth.js';

import ctrlWrapper from '../utils/ctrlWrapper.js';

import { registerSchema } from '../validation/user.js';

import { validateBody } from '../middlewares/validateBody.js';

const router = express.Router();
const jsonParser = express.json();

router.use(
  '/register',
  jsonParser,
  validateBody(registerSchema),
  ctrlWrapper(registerController),
);

export default router;

import express from 'express';

import { registerController } from '../controllers/auth.js';

import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = express.Router();

router.use('/register', ctrlWrapper(registerController));

export default router;

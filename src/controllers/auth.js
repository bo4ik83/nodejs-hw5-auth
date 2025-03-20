import createHttpError from 'http-errors';
import { registerUser, findUserByEmail, loginUser } from '../services/auth.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env;

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw createHttpError(409, 'Email in use');
    }

    const newUser = await registerUser({ name, email, password });

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  console.log('Login request:', req.body);
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      throw createHttpError(401, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createHttpError(401, 'Invalid email or password');
    }

    const accessToken = jwt.sign({ id: user._id }, JWT_ACCESS_SECRET, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    });

    await loginUser(user._id, refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });

    res.status(200).json({
      status: 'success',
      message: 'Successfully logged in!',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

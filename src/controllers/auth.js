import createHttpError from 'http-errors';
import {
  registerUser,
  findUserByEmail,
  loginUser,
  findUserByRefreshToken,
  updateUserToken,
  removeUserToken,
} from '../services/auth.js';
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
      status: 'success',
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

export const refreshSession = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token is missing');
    }

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await findUserByRefreshToken(refreshToken);

    if (!user || user._id.toString() !== decoded.id) {
      throw createHttpError(403, 'Invalid refresh token');
    }

    const newAccessToken = jwt.sign({ id: user._id }, JWT_ACCESS_SECRET, {
      expiresIn: '15m',
    });
    const newRefreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    });

    await updateUserToken(user._id, newRefreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });

    res.status(200).json({
      status: 'success',
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createHttpError(401, 'No refresh token provided');
    }

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await findUserByRefreshToken(refreshToken);

    if (!user || user._id.toString() !== decoded.id) {
      throw createHttpError(403, 'Invalid refresh token');
    }

    await removeUserToken(user._id);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

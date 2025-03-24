import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
  registerUser,
  findUserByEmail,
  loginUser,
  findUserByRefreshToken,
  updateUserToken,
} from '../services/auth.js';

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
    console.error('Error in register:', error);
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
      status: 200,
      message: 'Successfully logged in!',
      data: { accessToken },
    });
  } catch (error) {
    console.error('Error in login:', error);
    next(error);
  }
};

export const refreshSession = (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ status: 401, message: 'Refresh token is missing' });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign({ id: decoded.id }, JWT_ACCESS_SECRET, {
      expiresIn: '15m',
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken: newAccessToken },
    });
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return res
      .status(403)
      .json({ status: 403, message: 'Invalid refresh token' });
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createHttpError(401, 'No refresh token provided');
    }

    console.log('Received refresh token for logout:', refreshToken);

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      console.log('Decoded token:', decoded);
    } catch (err) {
      console.error('Error verifying refresh token:', err);
      throw createHttpError(403, 'Invalid refresh token');
    }

    const user = await findUserByRefreshToken(refreshToken);
    console.log('Found user:', user);

    if (!user || user._id.toString() !== decoded.id) {
      throw createHttpError(403, 'Invalid refresh token');
    }

    await updateUserToken(user._id, null);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error in logout:', error);
    next(error);
  }
};

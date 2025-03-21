import bcrypt from 'bcryptjs';
import { User } from '../db/models/user.js';

export const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

export const registerUser = async ({ name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return User.create({ name, email, password: hashedPassword });
};

export const loginUser = async (userId, refreshToken) => {
  return User.findByIdAndUpdate(userId, { refreshToken });
};

export const findUserByRefreshToken = async (refreshToken) => {
  return User.findOne({ refreshToken });
};

export const updateUserToken = async (userId, newRefreshToken) => {
  return User.findByIdAndUpdate(userId, { refreshToken: newRefreshToken });
};

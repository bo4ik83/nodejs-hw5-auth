import bcrypt from 'bcryptjs';
import { User } from '../db/models/user.js';

export const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

export const registerUser = async ({ name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await User.create({ name, email, password: hashedPassword });
};

export const loginUser = async (userId, refreshToken) => {
  return await User.findByIdAndUpdate(userId, { refreshToken }, { new: true });
};

export const findUserByRefreshToken = async (refreshToken) => {
  return User.findOne({ refreshToken });
};

export const updateUserToken = async (userId, newRefreshToken) => {
  return await User.findByIdAndUpdate(
    userId,
    { refreshToken: newRefreshToken },
    { new: true },
  );
};

export const removeUserToken = async (userId) => {
  return await User.findByIdAndUpdate(
    userId,
    { refreshToken: null },
    { new: true },
  );
};

export const findUserById = async (userId) => {
  return User.findById(userId);
};

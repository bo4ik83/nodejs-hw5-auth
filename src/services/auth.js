import bcrypt from 'bcryptjs';
import { User } from '../db/models/user.js';

export const findUserByEmail = (email) => User.findOne({ email });

export const registerUser = async ({ name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return User.create({ name, email, password: hashedPassword });
};

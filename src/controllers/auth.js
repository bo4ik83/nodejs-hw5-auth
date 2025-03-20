import createHttpError from 'http-errors';
import { registerUser, findUserByEmail } from '../services/auth.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Проверяем, существует ли пользователь
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw createHttpError(409, 'Email in use');
    }

    // Регистрируем нового пользователя
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

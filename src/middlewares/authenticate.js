import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

const { JWT_ACCESS_SECRET } = process.env;

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(createHttpError(401, 'No token provided'));
  }

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return next(createHttpError(401, 'Invalid token'));
  }
};

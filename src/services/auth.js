import { User } from '../db/models/user.js';

export function registerUser(payLoad) {
  return User.create(payLoad);
}

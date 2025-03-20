import { registerUser } from '../services/auth.js';

export async function registerController(req, res) {
  const user = await registerUser(req.body);

  res.json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
}

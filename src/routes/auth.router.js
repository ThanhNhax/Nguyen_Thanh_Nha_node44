import express from 'express';
import {
  login,
  register,
  loginFacebook,
} from '../controllers/auth.controller.js';
const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/loginFacebook', loginFacebook);
authRouter.post('/register', register);
export default authRouter;

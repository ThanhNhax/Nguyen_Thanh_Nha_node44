import express from 'express';
import {
  login,
  register,
  loginFacebook,
  extendToken,
  loginAsyncKey,
  forgotPassword,
  changePassword,
} from '../controllers/auth.controller.js';
const authRouter = express.Router();

authRouter.post('/login', login); // login bằng khóa đối xứng
authRouter.post('/extend-token', extendToken);
authRouter.post('/loginFacebook', loginFacebook);
authRouter.post('/register', register);
authRouter.post('/login-async-key', loginAsyncKey);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/change-password', changePassword);
export default authRouter;

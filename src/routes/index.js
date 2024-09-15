import express from 'express';
import { userRoutes } from './user.router.js';

const rootRouter = express.Router();

rootRouter.use('/users', userRoutes);

export default rootRouter;

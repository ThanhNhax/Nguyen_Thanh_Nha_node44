import express from 'express';
import { userRoutes } from './user.router.js';
import videosRoutes from './videos.route.js';
import videosTypesRoutes from './videoType.route.js';
import authRouter from './auth.router.js';

const rootRouter = express.Router();

rootRouter.use('/users', userRoutes);
rootRouter.use('/videos', videosRoutes);
rootRouter.use('/video-type', videosTypesRoutes);
rootRouter.use('/auth',authRouter);
export default rootRouter;

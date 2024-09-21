import express from 'express';
import { userRoutes } from './user.router.js';
import videosRoutes from './videos.route.js';

const rootRouter = express.Router();

rootRouter.use('/users', userRoutes);
rootRouter.use('/videos', videosRoutes);

export default rootRouter;

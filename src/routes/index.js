import express from 'express';
import ordersRoutes from './orders.route.js';
import usersRoutes from './user.route.js';
import likesRoutes from './likes.route.js';
import reviewsRoutes from './reviews.route.js';

const rootRouter = express.Router();

rootRouter.use('/orders', ordersRoutes);
rootRouter.use('/users', usersRoutes);
rootRouter.use('/likes', likesRoutes);
rootRouter.use('/reviews', reviewsRoutes);

export default rootRouter;

import express from 'express';
import { getLikes, likeRestaurant } from '../controllers/like.controller.js';

const likesRoutes = express.Router();

likesRoutes.get('/', getLikes);
likesRoutes.post('/', likeRestaurant);

export default likesRoutes;

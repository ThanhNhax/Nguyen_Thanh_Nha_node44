import express from 'express';
import { getReviews, createReviews } from '../controllers/review.controller.js';

const reviewsRoutes = express.Router();

reviewsRoutes.post('/', createReviews);
reviewsRoutes.get('/', getReviews);

export default reviewsRoutes;

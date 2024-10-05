import express from 'express';
import { createOrder, getOrder } from '../controllers/orders.controller.js';

const ordersRoutes = express.Router();

ordersRoutes.get('', getOrder);
ordersRoutes.post('/create', createOrder);

export default ordersRoutes;

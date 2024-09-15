import express from 'express';
import {
  getUser,
  createUser,
  deleteUser,
} from '../controllers/user.controller.js';

export const userRoutes = express.Router();

userRoutes.get('/', getUser);
userRoutes.post('/create', createUser);
userRoutes.delete('/:id', deleteUser);

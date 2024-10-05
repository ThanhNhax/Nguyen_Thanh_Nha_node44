import express from 'express';
import { getUsers } from '../controllers/users.controller.js';

const usersRoutes = express.Router();

usersRoutes.get('', getUsers);

export default usersRoutes;

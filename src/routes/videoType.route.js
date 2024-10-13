import express from 'express';
import {
  getAllVideoType,
  getListVideoById,
} from '../controllers/videoType.controller.js';
import { middleWareToken } from '../middleWare/token.js';

const videosTypesRoutes = express.Router();

videosTypesRoutes.get('/', middleWareToken, getAllVideoType);
videosTypesRoutes.get('/:id', getListVideoById);
// videosTypesRoutes.get('/get-video-type', getAllVideoTypes);
// videosTypesRoutes.get('/get-video-type/:id', getListVideoType);

export default videosTypesRoutes;

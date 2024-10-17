import express from 'express';
import {
  getAllVideoType,
  getListVideoById,
} from '../controllers/videoType.controller.js';
import { middleWaretoken } from '../middleWare/token.js';

const videosTypesRoutes = express.Router();

videosTypesRoutes.get('/', middleWaretoken, getAllVideoType);
videosTypesRoutes.get('/:id', getListVideoById);
// videosTypesRoutes.get('/get-video-type', getAllVideoTypes);
// videosTypesRoutes.get('/get-video-type/:id', getListVideoType);

export default videosTypesRoutes;

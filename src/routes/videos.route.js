import express from 'express';
import {
  getAllVideos,
  getAllVideoTypes,
  getListVideoType,
  getVideoById,
  getVideoPage,
} from '../controllers/videoController.js';
import { middleWaretoken } from '../middleWare/token.js';

const videosRoutes = express.Router();

videosRoutes.get('/:id', getVideoById);
videosRoutes.get('/', getAllVideos);
videosRoutes.get('/get-video-page/:page/:size', getVideoPage);
// videosRoutes.get('/get-video-type', getAllVideoTypes);
// videosRoutes.get('/get-video-type/:id', getListVideoType);

export default videosRoutes;

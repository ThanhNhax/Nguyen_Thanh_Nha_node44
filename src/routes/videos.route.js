import express from 'express';
import { getAllVideos } from '../controllers/videoController.js';

const videosRoutes = express.Router();

videosRoutes.get('/', getAllVideos);

export default videosRoutes;

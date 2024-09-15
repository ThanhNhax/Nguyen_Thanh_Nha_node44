import express from 'express';
import videoController from '../controllers/videoController.js';
const router = express.Router();

router.get('/', videoController);

export default router;

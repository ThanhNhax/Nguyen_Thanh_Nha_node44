import express from 'express';
import {
  getUser,
  createUser,
  deleteUser,
  uploadAvatar,
} from '../controllers/user.controller.js';
import { upload } from '../config/upload.js';
import { uploadCloud } from '../config/uploadCloud.js';

export const userRoutes = express.Router();

userRoutes.get('/', getUser);
userRoutes.post('/create', createUser);
userRoutes.delete('/:id', deleteUser);
userRoutes.post('/upload-avatar', upload.single('hinhAnh'), uploadAvatar);

userRoutes.post(
  '/upload-avatar-cloud',
  uploadCloud.single('hinhAnh'),
  (req, res) => {
    let file = req.file;
    return res.status(200).json({ file });
  }
);

import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
//Đọc file .env
dotenv.config();

export default {
  secretKey: process.env.SECRET_KEY,
};

export const createToken = (data) => {
  return jwt.sign(data, process.env.SECRET_KEY, {
    algorithm: 'HS256',
    expiresIn: '1d',
  });
};

export const verifyToken = (data) => {
  try {
    return jwt.verify(data, process.env.SECRET_KEY);
  } catch (e) {
    return { error: e };
  }
};

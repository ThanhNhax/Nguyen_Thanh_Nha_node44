import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import fs from 'fs';

let accessTokenPrivateKey = fs.readFileSync('access_token.private.key');
let accessTokenPublicKey = fs.readFileSync('access_token.public.key');

let refreshTokenPrivateKey = fs.readFileSync('refresh_token.private.key');

let refreshTokenPublicKey = fs.readFileSync('refresh_token.public.key');
//Đọc file .env
dotenv.config();

export default {
  secretKey: process.env.ACCESS_TOKEN_SECRET,
};

export const createToken = (data) => {
  return jwt.sign({ payload: data }, process.env.ACCESS_TOKEN_SECRET, {
    algorithm: 'HS256',
    expiresIn: '10s',
  });
};

export const verifyToken = (data) => {
  try {
    return jwt.verify(data, process.env.ACCESS_TOKEN_SECRET);
  } catch (e) {
    return { error: e };
  }
};

export const createRefToken = (data) => {
  return jwt.sign({ payload: data }, process.env.REFRESH_TOKEN_SECRET, {
    algorithm: 'HS256',
    expiresIn: '7d',
  });
};

export const createTokenAsyncKey = (data) => {
  return jwt.sign({ payload: data }, accessTokenPrivateKey, {
    algorithm: 'RS256',
    expiresIn: '7d',
  });
};

export const createRefTokenAsyncKey = (data) => {
  return jwt.sign({ payload: data }, refreshTokenPrivateKey, {
    algorithm: 'RS256',
    expiresIn: '7d',
  });
};

export const verifyTokenAsyncKey = (data) => {
  try {
    return jwt.verify(data, accessTokenPublicKey);
  } catch (e) {
    return { error: e };
  }
};

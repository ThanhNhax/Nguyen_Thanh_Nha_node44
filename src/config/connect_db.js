import dotenv from 'dotenv';

//Đọc file .env
dotenv.config();

export default {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
};

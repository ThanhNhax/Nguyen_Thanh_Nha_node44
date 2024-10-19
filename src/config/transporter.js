// lhrd elpo rohd cmew
import dotenv from 'dotenv';

//Đọc file .env
dotenv.config();
import nodemailer from 'nodemailer';
export const configEmail = {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
};
console.log({ configEmail });
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: configEmail.user,
    pass: configEmail.pass,
  },
});

export default transporter;

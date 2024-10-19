import express from 'express';
import cors from 'cors';
import rootRouter from './src/routes/index.js';
import cookieParser from 'cookie-parser';
const app = express();
const port = 8080;

//difine middleware để public folter public
app.use(express.static('.s'));

app.use(
  cors({
    origin: 'http://localhost:3000', //cấp quyền cho FE
    credentials: true, // cho phép FE lấy cookie và lưu ở cookie browser
  })
);

app.use(express.json());

app.use(cookieParser());

app.use(rootRouter);

app.listen(port, () => {
  console.log(`Server  listening on port ${port}`);
});

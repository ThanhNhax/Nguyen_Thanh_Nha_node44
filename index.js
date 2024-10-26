import express from 'express';
import cors from 'cors';
import rootRouter from './src/routes/index.js';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { PrismaClient } from '@prisma/client';
const app = express();

const server = createServer(app);

const port = 8080;

//difine middleware để public folter public
app.use(express.static('.'));

// thêm middleware cors để FE có thể call API tới BE
app.use(
  cors({
    origin: 'http://localhost:3000', // cấp quyền cho FE
    credentials: true, // cho phép FE lấy cookie và lưu vào cookie browser
  })
);
app.use(express.json());

app.use(cookieParser());

// io là obj của server
// on: nhận event
let number = 0;

const prisma = new PrismaClient();
const io = new Server(server, {
  cors: { origin: '*' },
});
io.on('connection', (socket) => {
  console.log(socket.id);

  socket.on('send-click', (data) => {
    io.emit('send-server', number++);
  });

  //Nhận event send-mess
  socket.on('send-mess', async ({ user_id, content }) => {
    let newChat = { user_id, content, date: new Date() };

    // lưu DB
    await prisma.chat.create({ data: newChat });
    // server bắn event cho client
    io.emit('server-send-mess', { user_id, content });
  });
});
// lắng nghe event kết nối từ client qua SocketIO

app.use(rootRouter);

server.listen(port, () => {
  console.log(`Server  listening on port ${port}`);
});

import express from 'express';
import cors from 'cors';
import rootRouter from './src/routes/index.js';
const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());
app.use(rootRouter);

app.listen(port, () => {
  console.log(`Server  listening on port ${port}`);
});

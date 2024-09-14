import express from 'express';
import cors from 'cors';
const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  console.log({ res });
  res.status(200).json({ message: 'Halo' });
});

app.get('/test-header', (req, res) => {
  const { headers } = req;
  res.json(headers);
});

app.get('/test-query', (req, res) => {
  const { query } = req;
  res.json({ query });
});

app.get('/videos', (req, res) => {
  let lstItem = [
    {
      video_id: 1,
      video_name:
        'Build and Deploy 5 JavaScript & React API Projects in 10 Hours - Full Course | RapidAPI',
      channelDetail: '',
      marginTop: ' ',
      thumbnail: 'https://i.ytimg.com/vi/QU9c0053UAU/hq720.jpg',
      channelId: 1,
      channelTitle: 'abc',
      channelId: 1,
      channelTitle: 'JavaScript Mastery',
    },
    {
      video_id: 2,
      video_name: 'The movies Iron man 4: 0.1 Hours',
      channelDetail: '',
      marginTop: ' ',
      thumbnail: 'https://i.ytimg.com/vi/t86sKsR4pnk/hq720.jpg',
      channelId: 1,
      channelTitle: 'abc',
      channelId: 1,
      channelTitle: 'JavaScript Mastery',
    },
  ];
  res.json(lstItem);
});

app.post('/users', (req, res) => {
  const { id, hoTen } = req.params;
  res.json({ id, hoTen });
});

app.listen(port, () => {
  console.log(`Server  listening on port ${port}`);
});

const { randomBytes } = require('crypto');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(express.json());

app.use(cors());

let posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts/create', async (req, res) => {
  try {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id] = { id, title };

    await axios.post('http://event-bus-srv:4005/events', {
      type: 'PostCreated',
      data: { id, title },
    });

    res.status(201).send(posts[id]);
  } catch (e) {
    console.log(e.message);
  }
});

app.post('/events', async (req, res) => {
  console.log('Recieved Event', req.body.type);

  res.send({});
});

app.listen(4000, () => {
  console.log('New version: v5');
  console.log(`server is up on port 4000`);
});

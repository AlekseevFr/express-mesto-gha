const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const router = require('./routes');

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '63d17b339aec30187038a904',
  };
  req.card = {
    _id: '63d16a0189624b198036652d',
  };
  next();
});

const { PORT = 3000, BASE_PATH } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log('Ссылка на сервер:');
  console.log(BASE_PATH);
});

app.use(bodyParser.json());
app.use(router);

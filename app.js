const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const router = require('./routes');

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '63cec4e0ecebe212282d280b',
  };

  next();
});

const { PORT = 3000, BASE_PATH } = process.env;

mongoose.connect('mongodb://localhost:3000/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log('Ссылка на сервер:');
  console.log(BASE_PATH);
});

app.use(bodyParser.json());
app.use(router);

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const router = require('./routes');

const app = express();
mongoose.connect('mongodb://localhost:27017/mesto', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
app.use(bodyParser.json());
app.use(cookieParser());
app.use(router);

app.use((err, req, res) => {
  res.status(500).send({ message: 'На сервере произошла ошибка' });
});

app.listen(3000, () => {});

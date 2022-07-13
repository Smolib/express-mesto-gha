const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes');

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '62ce64cd4c2c687f1e78a34b',
  };

  next();
});
app.use(router);

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('я живой');
});

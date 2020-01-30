const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const db = mongoose.connect('mongodb://localhost/userAPI', { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (!err) {
    console.log('Connected to mongo...');
  }
});
const port = process.env.PORT || 3000;

const User = require('./models/userModel')
const userRouter = require('./routes/userRouter')(User);

mongoose.Promise = Promise;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/api', userRouter);

app.listen(port, () => {
  console.log(`Running on port ${port}...`);
});

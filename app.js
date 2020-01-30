const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const db = mongoose.connect('mongodb://localhost/userAPI');
const port = process.env.PORT || 3000;

const User = require('./models/userModel')
const userRouter = require('./routes/userRouter')(User);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', userRouter);

app.listen(port, () => {
  console.log(`Running on port ${port}...`);
});

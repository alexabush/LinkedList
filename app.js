const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { ApiError } = require('./helpers');

const { jobsRouter, usersRouter, companiesRouter } = require('./routers');

const app = express();

const SECRET = 'apaulag';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: '*/*' }));

mongoose.Promise = Promise;
mongoose.set('debug', true);
mongoose
  .connect('mongodb://localhost/linkedList')
  .then(() => {
    console.log('successfully connected to database');
  })
  .catch(err => {
    console.log(err);
  });

const PORT = 3000;

app.use('/jobs', jobsRouter);
app.use('/users', usersRouter);
app.use('/companies', companiesRouter);

app.use((err, req, res, next) => {
  let apiError;
  if (!(err instanceof ApiError)) {
    apiError = new ApiError(500, 'Internal Server Error', err.message);
  } else {
    apiError = err;
  }
  return res.json(apiError);
});

app.listen(PORT, () => {
  console.log(`jobs API is listening on port ${PORT}`);
});

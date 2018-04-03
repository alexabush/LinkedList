const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { jobsRouter, usersRouter, companiesRouter } = require('./routers');

const app = express();

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
  return res
    .status(err.status || 500)
    .json({ message: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`jobs API is listening on port ${PORT}`);
});

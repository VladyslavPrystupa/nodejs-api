const express = require('express');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

//
const contactsRouter = require('./routes/api/contactsRoutes');
const usersRouter = require('./routes/api/userRoutes');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

//
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//
app.use('/api/contacts', contactsRouter);
app.use('/api/users', usersRouter);

//
app.use((_, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, _, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

module.exports = app;

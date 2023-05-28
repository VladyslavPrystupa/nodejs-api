const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();

mongoose.set('strictQuery', false);

// const { DB_HOST, PORT } = process.env;
// const DB_HOST =
//   'mongodb+srv://Vladyslav:qwerty1@cluster0.lzabk4l.mongodb.net/contacts_db?retryWrites=true&w=majority';
const PORT = 3000;
mongoose
  .connect(
    'mongodb+srv://Vladyslav:qwerty1@cluster0.lzabk4l.mongodb.net/contacts_db?retryWrites=true&w=majority'
  )
  .then(() => {
    app.listen(PORT);
    console.log('Database connection successful');
  })
  .catch(err => {
    console.log(err.message);
    process.exit(1);
  });

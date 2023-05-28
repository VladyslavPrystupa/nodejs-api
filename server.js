const mongoose = require('mongoose');
const app = require('./app');

// mongoose.set('strictQuery', false);

const DB_HOST =
  'mongodb+srv://Vladyslav:qwerty1@cluster0.lzabk4l.mongodb.net/contacts_db?retryWrites=true&w=majority';

mongoose
  .connect(DB_HOST)
  .then(
    app.listen(3000, () => {
      console.log('Database connection successful');
    })
  )
  .catch(err => {
    console.log(err.message);
    process.exit(1);
  });

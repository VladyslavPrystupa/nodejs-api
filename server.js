const mongoose = require('mongoose');
const app = require('./app');

mongoose.connect().then().catch();

app.listen(3000, () => {
  console.log('Server running. Use our API on port: 3000');
});

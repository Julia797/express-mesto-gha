const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// const { PORT = 3000, DB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
const PORT = 3000;
const DB_URL = 'mongodb://127.0.0.1:27017/mestodb';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/users', require('./routes/users'));

// app.listen(PORT);

app.listen(PORT, () => {
  console.log('Server started on port 9000');
});

//  mongodb://127.0.0.1:27017/mestodb
//  .then(() => console.log('MongoDB connected'))
// .catch((err) => console.log('MongoDB connection error:' ${err}));

// app.use('/users', require('./routes/users'));
/* app.listen(PORT, () => {
  console.log('Server started on port 9000');
}); */

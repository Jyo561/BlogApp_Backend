const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const postRoutes = require('./routes/posts');
const sequelize = require('./config/database');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api', postRoutes);

sequelize.sync()
  .then(() => {
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => console.log(err));


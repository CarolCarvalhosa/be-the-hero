const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { errors } = require('celebrate');

const app = express();

//dentro do paramentro do cors enviamos origin: http://www.meuapp.com
app.use(cors());
app.use(express.json());
app.use(routes);
app.use(errors());

module.exports = app;
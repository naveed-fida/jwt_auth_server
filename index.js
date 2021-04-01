const express = require("express");
const http = require("http");
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');
const mongoose = require('mongoose');

// DB SETUP
mongoose.connect('mongodb://127.0.0.1:27017/auth')
// SERVER PORT
const PORT = process.env.PORT || 3090;

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json({type: '*/*'}));
app.use('/', router);

http.createServer(app).listen(PORT,  () => {
    console.log(`Listening on port ${PORT}`);
});
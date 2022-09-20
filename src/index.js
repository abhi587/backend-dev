const express = require('express');
const bodyParser = require('body-parser');
// const multer = require('multer');
const route = require('./routes/route');
const { default: mongoose } = require('mongoose');
const connection = require("./db");
const app = express();
require('dotenv').config();

app.use(bodyParser.json());
// app.use(multer().any())
app.use(bodyParser.urlencoded({ extended: true }));




// database connection
connection();



app.use('/', route)

app.listen(process.env.PORT || 3000 , function () {
    console.log('Express app running on port' + (process.env.PORT || 3000 ))
});
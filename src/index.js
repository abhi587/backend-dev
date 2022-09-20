const express = require('express');
const bodyParser = require('body-parser');
// const multer = require('multer');
const route = require('./routes/route');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());
// app.use(multer().any())
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://abhishekprasad:abhiprasad@cluster0.ygncry8.mongodb.net/group18Database",
 { useNewUrlParser: true})

.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


app.use('/', route)

app.listen(process.env.PORT || 3000 , function () {
    console.log('Express app running on port' + (process.env.PORT || 3000 ))
});
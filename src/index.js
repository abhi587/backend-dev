const express = require ('express')
const bodyParser = require('body-parser')
const app = express()
const route = require('../src/routes/route')
const mongoose = require('mongoose')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


mongoose.connect("mongodb+srv://richardwork:2YLjcp0favzUASR9@cluster3.bli4t.mongodb.net/urlGroup34?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/' , route)

app.listen(process.env.PORT || 3000, function(){
    console.log("Express app running on PORT" + (process.env.PORT || 3000))
})
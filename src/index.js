const express = require('express')
const mongoose = require('mongoose')
const route = require('./route/route')
const app = express()


app.use(express.json())

mongoose.connect('mongodb+srv://khushi123456789:khushi123456789@cluster0.xcf6vy2.mongodb.net/Group-46-Database?retryWrites=true&w=majority',
{useNewUrlParser: true})

.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


app.use('/', route)

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});

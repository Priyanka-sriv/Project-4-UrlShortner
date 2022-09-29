const mongoose = require('mongoose')

const urlModel = new mongoose.Schema({
    longUrl: {
        type: String, required: true,
    },
    shortUrl: {
        type: String, required: true,unique:true
    },
    urlCode: {
        type: String, required: true, unique: true, trim: true,lowercase:true
    }
}, { timestamps: true })

module.exports = mongoose.model('URL', urlModel)

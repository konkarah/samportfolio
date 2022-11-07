const mongoose = require('mongoose')

const signalSchema = new mongoose.Schema({
    signal:{
        type: String
    },
    signaldate:{
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Signal', signalSchema)
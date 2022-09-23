const mongoose = require('mongoose')

const refcount = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('refcount', refcount)
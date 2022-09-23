const mongoose = require('mongoose')

const paid = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    lastPaid: {
        type: date,
        required: true
    }
})

module.exports = mongoose.model('paid', paid)
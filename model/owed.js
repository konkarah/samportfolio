const mongoose = require('mongoose')

const owedSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    refid: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('owed', owedSchema)
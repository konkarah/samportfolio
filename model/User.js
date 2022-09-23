const mongoose = require('mongoose')
const  uuid = require ('uuid')

const userSchema = new mongoose.Schema({
    userid:{
        type: String, 
        default: function genUUID() {
            return uuid.v4()}
    },
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', userSchema)
const mongoose = require('mongoose')

const registerSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    password1: String
})

const register = mongoose.model('register', registerSchema)
exports.Register = register;

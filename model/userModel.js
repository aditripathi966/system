const mongoose = require("mongoose")

const userDetails = mongoose.Schema({
    username:String,
    password:String,
    email:String
})

const user = mongoose.model("user", userDetails)

module.exports = user
const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/userModel").then(()=>{
    console.log("db cnnected")
}).catch((err)=>{
    console.log(err.message)
})

module.exports = mongoose
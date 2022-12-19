const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
   name:String,
   price:String,
   userID:String,
   category:String,
   company:String
})

module.exports = new mongoose.model("products",productSchema)
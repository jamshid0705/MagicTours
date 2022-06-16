const mongoose=require('mongoose')

const tourSchema=new mongoose.Schema({
  name:String,
  price:Number,
  duration:Number
})

const Tour=mongoose.model("tours",tourSchema)

module.exports=Tour
const mongoose=require('mongoose')

const tourSchema=new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'nameni kiriting'],
  },
  price: {
    type: Number,
    required: true,
  },
  maxGroupSize: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  summary: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
  },
  imageCover: {
    type: String,
  },
  images:  [String],
  startDates: [Date],
  
  createAt: {
    type: Date,
    default: Date.now(),
  },
})

const Tour=mongoose.model("tours",tourSchema)

module.exports=Tour
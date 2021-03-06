const Review=require('../model/reviews')
const appError=require('../utility/appError')
const catchError=require('../utility/catchError')

const getAllReview=catchError(async(req,res,next)=>{
  const review=await Review.find().populate({
    path:'user',
    select:'name'
  }).populate({
    path:'tour',
    select:'name'
  })

  res.status(200).json({
    status:'success',
    data:review
  })
})

const addReview=catchError(async(req,res,next)=>{
  const review=await Review.create(req.body)

  res.status(200).json({
    statsu:'success',
    data:review
  })
})

module.exports={addReview,getAllReview}
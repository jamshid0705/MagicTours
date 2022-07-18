const express=require('express')
const reviewController=require('../controller/reviewController')

const reviewRouter=express.Router()

reviewRouter.route('/').get(reviewController.getAllReview).post(reviewController.addReview)

module.exports=reviewRouter
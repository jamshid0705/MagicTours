
const express=require('express')

const { appendFile } = require('fs')
const Tour=require('../controller/tourController')

const tourRouter=express.Router()



// app.param
// tourRouter.param('id',Tour.chekId) // middleware
tourRouter.route('/stats').get(Tour.tourStatus)

tourRouter.route("/report/:year").get(Tour.tourReportYear)

tourRouter.use('/the-best-3-tours',(req,res,next)=>{
  req.query.sort='-price',
  req.query.limit=3,
  next()
},
Tour.getAllTour
)

tourRouter.route('/').get(Tour.getAllTour).post(Tour.addTour)
tourRouter.route('/:id').get(Tour.getIdTour).patch(Tour.updateTour).delete(Tour.deleteTour)

module.exports=tourRouter
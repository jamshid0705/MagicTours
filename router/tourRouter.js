
const express=require('express')

const { appendFile } = require('fs')
const Tour=require('../controller/tourController')

const tourRouter=express.Router()

// app.param
// tourRouter.param('id',Tour.chekId) // middleware 


tourRouter.route('/').get(Tour.getAllTour).post(Tour.addTour)
tourRouter.route('/:id').get(Tour.getIdTour).patch(Tour.updateTour).delete(Tour.deleteTour)

module.exports=tourRouter
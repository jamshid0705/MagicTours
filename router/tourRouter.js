const fs=require('fs')
const tours=JSON.stringify(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`,'utf-8'))

const express=require('express')
const app=express()
const { appendFile } = require('fs')
const Tour=require('../controller/tourController')

const tourRouter=express.Router()

// app.param
tourRouter.param('id',Tour.chekId) // middleware

tourRouter.route('/').get(Tour.getAllTour).post(Tour.addTour)
tourRouter.route('/:id').get(Tour.getIdTour).patch(Tour.updateTour).delete(Tour.deleteTour)

module.exports=tourRouter
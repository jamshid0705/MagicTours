const express=require('express')
const tourRouter=require('./router/tourRouter')
const userRouter=require('./router/userRouter')

const app=express();

const appError=require('./utility/appError')
const appErrorController=require('./controller/appErrorController')


// midleware
app.use(express.json())

app.use(express.static('public'))  // html fayllarini oqish un
// route
app.use('/api/v1/tours',tourRouter)
app.use('/api/v1/users',userRouter)  // middleware

app.all('*',function(req,res,next){
 
 next(new appError(`This is page not found ${req.originalUrl}`,404 ))
})


//////////////// Error middleware /////////////////////////

app.use(appErrorController)
module.exports=app
// console.log(process.env)
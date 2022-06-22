const express=require('express')
const tourRouter=require('./router/tourRouter')
const userRouter=require('./router/userRouter')

const app=express();

const appError=require('./utility/appError')


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

app.use((err,req,res,next)=>{
   err.statusCode=err.statusCode || 404,
   err.status=err.status || 'fail',
   err.message=err.message || "not found"

   res.status(err.statusCode).json({
    status:err.status,
    statusCode:err.statusCode,
    data:err.message,
    stack:err.stack
   })

   next()
})
module.exports=app
// console.log(process.env)